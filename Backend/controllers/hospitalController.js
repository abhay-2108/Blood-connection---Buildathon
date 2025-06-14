const Hospital = require("../models/Hospital.js");
const BloodRequest = require("../models/BloodRequest.js");
const { sendBloodRequest } = require("../utils/emailService.js");
const axios = require("axios"); // For Nominatim API calls

// Helper function for Haversine distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// New controller function
const findNearestHospital = async (req, res) => {
    const { userCity, userState } = req.query;

    if (!userCity || !userState) {
        return res.status(400).json({ message: "User city and state are required as query parameters." });
    }

    try {
        const hospitals = await Hospital.find().select("hospitalName location email"); // Added email for potential contact
        if (!hospitals || hospitals.length === 0) {
            return res.status(404).json({ message: "No hospitals found in the database." });
        }

        // Geocode user's location
        const userLocationString = `${userCity}, ${userState}`;
        let userCoords = null;
        try {
            const userGeoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(userLocationString)}&limit=1`, {
                headers: { 'User-Agent': 'BloodConnectionApp/1.0 abhaman2006@gmail.com' } // Important: Set a User-Agent
            });
            if (userGeoResponse.data && userGeoResponse.data.length > 0) {
                userCoords = { lat: parseFloat(userGeoResponse.data[0].lat), lon: parseFloat(userGeoResponse.data[0].lon) };
            } else {
                console.warn(`Could not geocode user location: ${userLocationString}`);
            }
            // console.log(`Simulating geocoding for user: ${userLocationString}`); // Placeholder
            // Dummy userCoords for testing without API calls:
            // userCoords = { lat: 28.6139, lon: 77.2090 }; // Example: Delhi
        } catch (geoError) {
            console.error(`Error geocoding user location ${userLocationString}:`, geoError.response ? geoError.response.data : geoError.message);
            // Decide if we should proceed without user coords or return an error
        }

        if (!userCoords) {
            // If user geocoding fails, we can't calculate distances.
            // We could return all hospitals, or an error, or hospitals with a note.
            return res.status(400).json({ 
                message: `Could not determine coordinates for user location: ${userLocationString}. Unable to calculate distances.`,
                hospitals: hospitals.map(h => ({ name: h.hospitalName, city: h.location.city, state: h.location.state })) // Send basic hospital info
            });
        }

        const hospitalsWithDistance = [];

        for (const hospital of hospitals) {
            const hospitalLocationString = `${hospital.location.city}, ${hospital.location.state}`;
            let hospitalCoords = null;
            try {
                // Add a small delay to respect Nominatim's usage policy (1 req/sec)
                await new Promise(resolve => setTimeout(resolve, 1000));

                const hospitalGeoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(hospitalLocationString)}&limit=1`, {
                    headers: { 'User-Agent': 'BloodConnectionApp/1.0 (your-email@example.com)' } // Important: Set a User-Agent
                });
                if (hospitalGeoResponse.data && hospitalGeoResponse.data.length > 0) {
                   hospitalCoords = { lat: parseFloat(hospitalGeoResponse.data[0].lat), lon: parseFloat(hospitalGeoResponse.data[0].lon) };
                } else {
                   console.warn(`Could not geocode hospital: ${hospital.hospitalName} at ${hospitalLocationString}`);
                   hospitalsWithDistance.push({
                       name: hospital.hospitalName,
                       city: hospital.location.city,
                       state: hospital.location.state,
                       email: hospital.email,
                       distance: null,
                       geocodingError: "Could not geocode hospital location."
                   });
                   continue;
                }
                // console.log(`Simulating geocoding for hospital: ${hospital.hospitalName} at ${hospitalLocationString}`); // Placeholder
                 // Dummy hospitalCoords for testing:
                // hospitalCoords = { lat: hospital.location.city.length + 20, lon: hospital.location.state.length + 70 };

                if (hospitalCoords) { // Check if hospital geocoding was successful
                    const distance = getDistanceFromLatLonInKm(userCoords.lat, userCoords.lon, hospitalCoords.lat, hospitalCoords.lon);
                    hospitalsWithDistance.push({
                        name: hospital.hospitalName,
                        city: hospital.location.city,
                        state: hospital.location.state,
                        email: hospital.email,
                        distance: parseFloat(distance.toFixed(2)), // distance in km, rounded
                        latitude: hospitalCoords.lat,
                        longitude: hospitalCoords.lon
                    });
                } else {
                     // If hospital geocoding failed but user geocoding succeeded
                    hospitalsWithDistance.push({
                        name: hospital.hospitalName,
                        city: hospital.location.city,
                        state: hospital.location.state,
                        email: hospital.email,
                        distance: null,
                        geocodingError: "Could not geocode hospital location."
                    });
                }
            } catch (geoError) {
                console.error(`Error geocoding hospital ${hospital.hospitalName} at ${hospitalLocationString}:`, geoError.response ? geoError.response.data : geoError.message);
                hospitalsWithDistance.push({
                    name: hospital.hospitalName,
                    city: hospital.location.city,
                    state: hospital.location.state,
                    email: hospital.email,
                    distance: null,
                    geocodingError: `Geocoding failed: ${geoError.message}`
                });
            }
        }

        // Sort by distance, handling nulls (hospitals that couldn't be geocoded or user loc failed)
        hospitalsWithDistance.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1; // push nulls to the end
            if (b.distance === null) return -1; // push nulls to the end
            return a.distance - b.distance;
        });
        
        res.json(hospitalsWithDistance);

    } catch (err) {
        console.error("Error in findNearestHospital controller:", err);
        res.status(500).json({ message: "Server error while finding nearest hospital." });
    }
};

const getHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user.id).select(
            "-password"
        );
        res.json(hospital);
    } catch (err) {
        console.error("Error in getHospitalProfile:", err); // Add this line to log the error
        res.status(500).json({ message: err.message });
    }
};

const updateInventory = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user.id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Update inventory with the new values
        hospital.inventory = {
            ...hospital.inventory,
            ...req.body,
        };

        const updatedHospital = await hospital.save();

        // Return the updated inventory
        res.json({
            message: "Inventory updated successfully",
            inventory: updatedHospital.inventory,
        });
    } catch (err) {
        console.error("Error updating inventory:", err);
        res.status(500).json({ message: "Error updating inventory" });
    }
};

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().select("-password");
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id).select(
            "-password"
        );
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.json(hospital);
    } catch (err) {
        console.error("Error fetching hospital:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        // (Optional) Validate comment length
        if (comment && comment.length > 500) {
            return res.status(400).json({ message: "Comment is too long (max 500 chars)" });
        }
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Use the name from the JWT token
        const review = {
            userName: req.user.name, // This comes from the JWT token now
            rating,
            comment,
            date: new Date(),
        };

        hospital.reviews.unshift(review); // Add new review at the beginning
        await hospital.save();

        res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Error adding review" });
    }
};

const requestBlood = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { patientName, bloodGroup, unitsRequired } = req.body;
        // Input validation
        if (!patientName || !bloodGroup || !unitsRequired) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (typeof unitsRequired !== "number" || unitsRequired < 1) {
            return res.status(400).json({ message: "Units required must be a positive number" });
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Check if hospital has enough blood units
        const bloodGroupMapping = {
            "A+": "aPositive",
            "A-": "aNegative",
            "B+": "bPositive",
            "B-": "bNegative",
            "AB+": "abPositive",
            "AB-": "abNegative",
            "O+": "oPositive",
            "O-": "oNegative",
        };

        const inventoryKey = bloodGroupMapping[bloodGroup];
        if (!inventoryKey || hospital.inventory[inventoryKey] < unitsRequired) {
            return res.status(400).json({
                message: "Requested blood units not available",
            });
        }

        // Create blood request
        const bloodRequest = new BloodRequest({
            patientName,
            bloodGroup,
            unitsRequired,
            hospital: hospitalId,
        });
        await bloodRequest.save();

        // Send email notification
        try {
            await sendBloodRequest(hospital.email, {
                patientName,
                bloodGroup,
                unitsRequired,
                replyTo: process.env.EMAIL_USER,
            });
            console.log("Here i am ");
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Continue with the request even if email fails
        }

        res.status(201).json({
            message: "Blood request sent successfully",
            requestId: bloodRequest._id,
        });
    } catch (error) {
        console.error("Blood request error:", error);
        res.status(500).json({
            message: "Error processing blood request",
            error: error.message,
        });
    }
};

module.exports = {
    getHospitalProfile,
    updateInventory,
    getAllHospitals,
    getHospitalById,
    addReview,
    requestBlood,
    findNearestHospital, // Add this line
};

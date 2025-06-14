const EmergencyRequest = require("../models/EmergencyRequest");
const Hospital = require("../models/Hospital");

const createEmergencyRequest = async (req, res) => {
    try {
        const { name, phone, bloodGroup, units, hospital, location } = req.body;
        // Input validation
        if (!name || !phone || !bloodGroup || !units || !hospital || !location || !location.city) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Create new emergency request
        const emergencyRequest = new EmergencyRequest({
            name,
            phone,
            bloodGroup,
            units,
            hospital,
            location,
            status: "PENDING",
        });

        await emergencyRequest.save();

        // Find hospitals in the same city (case-insensitive)
        // (Commented out since not used, uncomment if needed)
        // const nearbyHospitals = await Hospital.find({
        //     "location.city": { $regex: `^${location.city}$`, $options: "i" },
        // });

        // In a real application, you would:
        // 1. Send notifications to nearby hospitals
        // 2. Implement WebSocket for real-time updates
        // 3. Send SMS/Email notifications

        res.status(201).json({
            message: "Emergency request created successfully",
            requestId: emergencyRequest._id,
        });
    } catch (error) {
        console.error("Error creating emergency request:", error);
        res.status(500).json({ message: "Error creating emergency request" });
    }
};

const getEmergencyRequests = async (req, res) => {
    try {
        const requests = await EmergencyRequest.find({
            status: "PENDING",
        }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching emergency requests:", error);
        res.status(500).json({ message: "Error fetching emergency requests" });
    }
};

module.exports = {
    createEmergencyRequest,
    getEmergencyRequests,
};

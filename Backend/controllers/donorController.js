// controllers/donorController.js
const Donor = require("../models/Donor");

// Register a new donor
const registerDonor = async (req, res) => {
    try {
        const { name, email, phone, bloodGroup, city, state } = req.body;

        if (!name || !email || !phone || !bloodGroup || !city || !state) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if donor already exists (optional - based on email)
        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(409).json({ message: "Donor with this email already registered." });
        }

        const donor = new Donor({ name, email, phone, bloodGroup, city, state });
        await donor.save();

        res.status(201).json({ message: "Donor registered successfully!", donor });
    } catch (err) {
        console.error("Error registering donor:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Get all donors
const getAllDonors = async (req, res) => {
    try {
        const { bloodGroup, city, state } = req.query;

        const query = {};
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (city) query.city = new RegExp(city, "i"); // case-insensitive
        if (state) query.state = new RegExp(state, "i");

        const donors = await Donor.find(query).select("-__v");
        res.json(donors);
    } catch (err) {
        console.error("Error fetching donors:", err);
        res.status(500).json({ message: "Failed to retrieve donors." });
    }
};

// Search donors by blood group, city, and state
const searchDonors = async (req, res) => {
    try {
        const { bloodGroup, city, state } = req.query;
        const query = {};

        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (city) query.city = { $regex: new RegExp(city, "i") }; // case-insensitive
        if (state) query.state = { $regex: new RegExp(state, "i") };

        const donors = await Donor.find(query).select("-__v");
        res.json(donors);
    } catch (err) {
        console.error("Error searching donors:", err);
        res.status(500).json({ message: "Failed to search donors." });
    }
};



// (Optional) Update donor profile if needed
const updateDonor = async (req, res) => {
    try {
        const allowedFields = ["name", "phone", "bloodGroup", "city", "state"];
        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const donor = await Donor.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!donor) return res.status(404).json({ message: "Donor not found" });

        res.json(donor);
    } catch (err) {
        console.error("Error updating donor:", err);
        res.status(500).json({ message: "Failed to update donor." });
    }
};

module.exports = {
    registerDonor,
    getAllDonors,
    updateDonor,
    searchDonors
}

const User = require("../models/User.js");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Failed to fetch user profile. Please try again later." });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const allowedFields = ["name", "phone", "location", "bloodGroup", "organDonation"];
        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true, select: "-password" }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ message: "Failed to update user profile. Please try again later." });
    }
};

module.exports = { getUserProfile, updateUserProfile };

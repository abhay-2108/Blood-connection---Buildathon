const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Add name field
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    organDonation: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;


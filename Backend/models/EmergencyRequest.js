const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v); // 10-15 digits
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    units: {
        type: Number,
        required: true,
        min: 1,
    },
    hospital: {
        type: String, // Consider ObjectId ref if referencing Hospital
    },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["PENDING", "FULFILLED", "EXPIRED"],
        default: "PENDING",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800, // Document will be automatically deleted after 30 minutes
    },
});

const EmergencyRequest = mongoose.model(
    "EmergencyRequest",
    emergencyRequestSchema
);
module.exports = EmergencyRequest;

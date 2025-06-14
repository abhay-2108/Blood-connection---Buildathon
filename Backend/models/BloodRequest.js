const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
    },
    patientPhone: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return !v || /^\d{10,15}$/.test(v); // Optional, but if present, must be 10-15 digits
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    unitsRequired: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Auto-delete after 24 hours (optional)
    },
}, { timestamps: true });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

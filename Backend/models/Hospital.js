const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
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
    password: { type: String, required: true },
    hospitalName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    inventory: {
        aPositive: { type: Number, default: 0 },
        aNegative: { type: Number, default: 0 },
        bPositive: { type: Number, default: 0 },
        bNegative: { type: Number, default: 0 },
        abPositive: { type: Number, default: 0 },
        abNegative: { type: Number, default: 0 },
        oPositive: { type: Number, default: 0 },
        oNegative: { type: Number, default: 0 },
    },
    reviews: [
        {
            userName: String,
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            date: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;

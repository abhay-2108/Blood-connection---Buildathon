const express = require("express");
const Hospital = require("../models/Hospital");
const User = require("../models/User");
const EmergencyRequest = require("../models/EmergencyRequest");
const router = express.Router();

router.get("/data", async (_req, res) => {
    try {
        const [hospitals, users, emergencies] = await Promise.all([
            Hospital.find().select("-password"),
            User.find().select("-password"),
            EmergencyRequest.find().sort("-createdAt").limit(10),
        ]);

        // Initialize blood inventory accumulator
        const initialInventory = {
            aPositive: 0,
            aNegative: 0,
            bPositive: 0,
            bNegative: 0,
            abPositive: 0,
            abNegative: 0,
            oPositive: 0,
            oNegative: 0,
        };

        // Calculate more detailed statistics
        const statistics = {
            totalHospitals: hospitals.length,
            totalUsers: users.length,
            activeEmergencies: emergencies.filter((e) => e.status === "PENDING")
                .length,
            bloodInventory: hospitals.reduce((acc, hospital) => {
                // Sum up inventory from each hospital
                if (hospital.inventory) {
                    acc.aPositive += hospital.inventory.aPositive || 0;
                    acc.aNegative += hospital.inventory.aNegative || 0;
                    acc.bPositive += hospital.inventory.bPositive || 0;
                    acc.bNegative += hospital.inventory.bNegative || 0;
                    acc.abPositive += hospital.inventory.abPositive || 0;
                    acc.abNegative += hospital.inventory.abNegative || 0;
                    acc.oPositive += hospital.inventory.oPositive || 0;
                    acc.oNegative += hospital.inventory.oNegative || 0;
                }
                return acc;
            }, { ...initialInventory }),
            cityWiseDistribution: hospitals.reduce((acc, h) => {
                const city = h.location && h.location.city ? h.location.city : "Unknown";
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {}),
            recentDonations: 0, // TODO: Implement recentDonations if data available
            averageRating: calculateAverageRating(hospitals),
            emergencyResponseTime: "30 minutes",
            bloodTypeDistribution: calculateBloodTypeDistribution(users),
        };

        res.json({
            hospitals: hospitals.map((h) => ({
                name: h.hospitalName,
                location: h.location,
                inventory: h.inventory,
                reviews: h.reviews,
                rating: calculateHospitalRating(h),
            })),
            users: users.map((u) => ({
                bloodGroup: u.bloodGroup,
                location: u.location,
            })),
            emergencies: emergencies.map((e) => ({
                bloodGroup: e.bloodGroup,
                status: e.status,
                location: e.location,
                createdAt: e.createdAt,
            })),
            statistics,
        });
    } catch (error) {
        console.error("Error fetching chatbot data:", error);
        res.status(500).json({ message: "Error fetching chatbot data" });
    }
});

function calculateAverageRating(hospitals) {
    const ratings = hospitals.flatMap((h) => (Array.isArray(h.reviews) ? h.reviews.map((r) => r.rating) : []));
    return ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;
}

function calculateHospitalRating(hospital) {
    const ratings = Array.isArray(hospital.reviews) ? hospital.reviews.map((r) => r.rating) : [];
    return ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;
}

function calculateBloodTypeDistribution(users) {
    return users.reduce((acc, user) => {
        acc[user.bloodGroup] = (acc[user.bloodGroup] || 0) + 1;
        return acc;
    }, {});
}

module.exports = router;

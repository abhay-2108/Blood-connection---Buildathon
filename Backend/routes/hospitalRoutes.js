const express = require("express");
const {
    getHospitalProfile,
    updateInventory,
    getAllHospitals,
    getHospitalById,
    addReview,
    requestBlood,
    findNearestHospital, // Add this
} = require("../controllers/hospitalController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/profile", authMiddleware, getHospitalProfile);
router.put("/inventory", authMiddleware, updateInventory);
router.get("/", getAllHospitals);
router.get("/:id", getHospitalById);
router.post("/:id/reviews", authMiddleware, addReview);
router.post("/:hospitalId/request-blood", requestBlood);
router.get("/nearest", findNearestHospital); // New route for finding nearest hospital

module.exports = router;

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
    console.log("Received POST at /api/predict");
    const inputData = req.body;

    const pythonProcess = spawn("python", [
        path.join(__dirname, "../models/predict.py"),
        JSON.stringify(inputData)
    ]);

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", (code) => {
        try {
            const output = JSON.parse(result);
            res.status(200).json(output);
        } catch (err) {
            console.error("❌ JSON parse error:", err.message);
            res.status(500).json({ error: "Model response was not valid JSON" });
        }
    });
});

module.exports = router;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Hospital = require("../models/Hospital.js");

const checkJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }
};

const isValidEmail = (email) =>
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerUser = async (req, res) => {
    let { name, email, phone, password, bloodGroup, location, organDonation } =
        req.body;
    try {
        if (!name || !email || !password || !bloodGroup || !location) {
            return res
                .status(400)
                .json({ message: "All required fields must be provided" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const user = new User({
            name,
            email,
            phone,
            password: bcrypt.hashSync(password, 10),
            bloodGroup,
            location,
            organDonation,
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error in registerUser:", err); // Log registration error
        res.status(500).json({
            message: "Registration failed. Please try again later.",
        });
    }
};

const registerHospital = async (req, res) => {
    let { email, phone, password, hospitalName, registrationNumber, location } =
        req.body;
    try {
        if (
            !email ||
            !password ||
            !hospitalName ||
            !registrationNumber ||
            !location
        ) {
            return res
                .status(400)
                .json({ message: "All required fields must be provided" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        email = email.toLowerCase();
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hospital = new Hospital({
            email,
            phone,
            password: bcrypt.hashSync(password, 10),
            hospitalName,
            registrationNumber,
            location,
        });
        await hospital.save();
        res.status(201).json({ message: "Hospital registered successfully" });
    } catch (err) {
        console.error("Error in registerHospital:", err); // Log registration error
        res.status(500).json({
            message: "Registration failed. Please try again later.",
        });
    }
};

const loginUser = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        email = email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        checkJwtSecret();

        const token = jwt.sign(
            {
                id: user._id,
                type: "user",
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Convert user to object and remove password before sending
        const { password: pw, __v, ...userDetails } = user.toObject();

        res.json({
            token,
            userType: "user",
            user: userDetails, // full user details (excluding password)
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
};


const loginHospital = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        email = email.toLowerCase();
        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        checkJwtSecret();
        const token = jwt.sign(
            { id: hospital._id, type: "hospital" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token, userType: "hospital" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
};

module.exports = { registerUser, registerHospital, loginUser, loginHospital };

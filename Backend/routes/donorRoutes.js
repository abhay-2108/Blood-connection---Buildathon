const express = require("express");
const router = express.Router();
const {
    registerDonor,
    getAllDonors,
    updateDonor,
    searchDonors
} = require("../controllers/donorController");
const { sendDonorContactEmail } = require('../utils/emailService');

// POST /api/donate/   →  Register donor
router.post("/", registerDonor);

// GET /api/donate/all →  Get all donors
router.get("/all", getAllDonors);

router.get("/search", searchDonors);

// PUT /api/donate/:id →  Update a donor (optional)
router.put("/:id", updateDonor);

// Route for sending email to donors (for your find-donor feature)
router.post('/send-email', async (req, res) => {
    try {
        const {
            to,           // Donor's email
            toName,       // Donor's name
            from,         // Sender's email
            fromName,     // Sender's name
            subject,
            message,
            senderPhone,
            urgency,
            donorBloodGroup,
            donorLocation
        } = req.body;

        // Validate required fields
        if (!to || !toName || !from || !fromName || !subject || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: to, toName, from, fromName, subject, message' 
            });
        }

        // Prepare contact details for the template
        const contactDetails = {
            to,
            toName,
            from,
            fromName,
            subject,
            message,
            senderPhone,
            urgency: urgency || 'normal',
            donorBloodGroup,
            donorLocation
        };

        // Send email using the service
        const result = await sendDonorContactEmail(to, contactDetails);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully to donor',
            donorEmail: to,
            donorName: toName,
            messageId: result.messageId
        });

    } catch (error) {
        console.error('Error sending donor contact email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

module.exports = router;

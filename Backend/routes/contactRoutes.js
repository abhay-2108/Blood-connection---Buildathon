const express = require("express")
const router = express.Router()

// Import your email service
const { sendEmail } = require("../utils/emailService")

// Route for contact form messages
router.post("/send-message", async (req, res) => {
  try {
    console.log("📧 Contact route hit! Request body:", req.body)

    const { name, email, message, subject, type } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      console.log("❌ Validation failed: Missing required fields")
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, message",
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email")
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      })
    }

    // Log the contact form submission
    console.log("📧 Contact form submission received:")
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Subject:", subject || `Contact Form Message from ${name}`)
    console.log("Message:", message)
    console.log("Type:", type || "Contact Form")
    console.log("Timestamp:", new Date().toISOString())

    // Try to send email
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">📧 New Contact Form Message</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Type:</strong> ${type || "Contact Form"}</li>
            </ul>
          </div>

          <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h4>Message:</h4>
            <p style="font-style: italic;">"${message}"</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This message was sent through BloodConnection contact form.
          </p>
        </div>
      `

      const result = await sendEmail(
        "support@bloodconnection.com", // Your support email
        subject || `Contact Form Message from ${name}`,
        htmlContent,
      )

      console.log("✅ Email sent successfully:", result.messageId)
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError)
      // Continue processing even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We will get back to you soon.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error processing contact form:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    })
  }
})

// Health check route for contact service
router.get("/health", (req, res) => {
  console.log("📞 Contact health check requested")
  res.json({
    status: "OK",
    service: "Contact Service",
    timestamp: new Date().toISOString(),
  })
})

// Test route to verify contact routes are working
router.get("/test", (req, res) => {
  console.log("🧪 Contact test route hit")
  res.json({
    message: "Contact routes are working!",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router

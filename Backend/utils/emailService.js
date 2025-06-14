const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter with your existing configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use your 16-digit app password here
    },
});

// Verify transporter configuration
const verifyEmailService = async () => {
    try {
        await transporter.verify();
        console.log("✅ Email service is ready to send emails");
        return true;
    } catch (error) {
        console.error("❌ Email service verification failed:", error);
        return false;
    }
};

// General email sending function
const sendEmail = async (emailOptions) => {
    try {
        const {
            to,
            subject,
            html,
            text,
            from = {
                name: "BloodBond Platform",
                address: process.env.EMAIL_USER,
            },
            replyTo,
            priority = "normal", // normal, high, urgent
            attachments = []
        } = emailOptions;

        // Validate required fields
        if (!to || !subject || (!html && !text)) {
            throw new Error("Missing required email fields: to, subject, and content (html or text)");
        }

        const mailOptions = {
            from,
            to,
            subject,
            html,
            text,
            replyTo,
            attachments,
        };

        // Set priority headers based on priority level
        if (priority === "high" || priority === "urgent") {
            mailOptions.headers = {
                "X-Priority": priority === "urgent" ? "1" : "2",
                "X-MSMail-Priority": priority === "urgent" ? "High" : "Normal",
                "Importance": priority === "urgent" ? "high" : "normal",
            };
        }

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}:`, result.messageId);
        return { 
            success: true, 
            messageId: result.messageId,
            to,
            subject 
        };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Email Templates
const emailTemplates = {
    // Blood request template (your existing one, improved)
    bloodRequest: (requestDetails) => ({
        subject: `URGENT: Blood Request - ${requestDetails.bloodGroup} Required`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              padding: 20px;
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background: linear-gradient(135deg, #d32f2f, #b71c1c);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              border: 1px solid #ccc;
              border-radius: 0 0 8px 8px;
              padding: 20px;
              background: #f9f9f9;
            }
            .button {
              background: linear-gradient(135deg, #d32f2f, #b71c1c);
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 10px 0;
              cursor: pointer;
              border-radius: 25px;
              border: none;
            }
            .urgent {
              color: #d32f2f;
              font-weight: bold;
              font-size: 18px;
              background: #ffebee;
              padding: 10px;
              border-radius: 5px;
              border-left: 4px solid #d32f2f;
            }
            .details {
              background: white;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🩸 Emergency Blood Request</h2>
            </div>
            <div class="content">
              <p>A new emergency blood request has been received:</p>
              <div class="details">
                <ul style="list-style: none; padding: 0;">
                  <li><strong>👤 Patient Name:</strong> ${requestDetails.patientName}</li>
                  <li><strong>🩸 Blood Group Required:</strong> <span style="color: #d32f2f; font-size: 18px;">${requestDetails.bloodGroup}</span></li>
                  <li><strong>📊 Units Required:</strong> ${requestDetails.unitsRequired}</li>
                  <li><strong>📅 Request Date:</strong> ${new Date().toLocaleDateString()}</li>
                  <li><strong>⏰ Request Time:</strong> ${new Date().toLocaleTimeString()}</li>
                  ${requestDetails.hospitalName ? `<li><strong>🏥 Hospital:</strong> ${requestDetails.hospitalName}</li>` : ''}
                  ${requestDetails.contactNumber ? `<li><strong>📞 Contact:</strong> ${requestDetails.contactNumber}</li>` : ''}
                </ul>
              </div>
              <div class="urgent">
                ⚠️ URGENT: Please respond within 30 minutes
              </div>
              <div style="text-align: center; margin: 20px 0;">
                <a href="mailto:${requestDetails.replyTo || process.env.EMAIL_USER}" class="button">
                  📧 Respond to Request
                </a>
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                If the button doesn't work, please reply directly to this email.
              </p>
              <p>
                Best regards,<br>
                <strong>The BloodBond Team</strong> ❤️
              </p>
            </div>
          </div>
        </body>
        </html>
        `,
        priority: "urgent"
    }),

    // Donor contact template (for your find-donor feature)
    donorContact: (contactDetails) => ({
        subject: `[${contactDetails.urgency.toUpperCase()}] ${contactDetails.subject}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .content { border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; padding: 30px; background: #f9fafb; }
            .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .contact-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px 0; }
            .urgency-emergency { color: #dc2626; background: #fef2f2; }
            .urgency-urgent { color: #f59e0b; background: #fffbeb; }
            .urgency-normal { color: #10b981; background: #f0fdf4; }
            .urgency-badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩸 Blood Donation Request</h1>
            </div>
            <div class="content">
              <h2>Dear ${contactDetails.toName},</h2>
              
              <div class="details-box">
                <h3 style="color: #ef4444; margin-top: 0;">Request Details</h3>
                <p><strong>Blood Group Needed:</strong> <span style="color: #ef4444; font-size: 18px;">${contactDetails.donorBloodGroup}</span></p>
                <p><strong>Urgency Level:</strong> 
                  <span class="urgency-badge urgency-${contactDetails.urgency}">${contactDetails.urgency}</span>
                </p>
                <p><strong>Your Location:</strong> ${contactDetails.donorLocation}</p>
              </div>

              <div class="message-box">
                <h3 style="color: #1f2937; margin-top: 0;">Message from ${contactDetails.fromName}</h3>
                <p style="line-height: 1.6; color: #4b5563;">${contactDetails.message.replace(/\n/g, '<br>')}</p>
              </div>

              <div class="contact-box">
                <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
                <p><strong>Name:</strong> ${contactDetails.fromName}</p>
                <p><strong>Email:</strong> <a href="mailto:${contactDetails.from}" style="color: #ef4444;">${contactDetails.from}</a></p>
                ${contactDetails.senderPhone ? `<p><strong>Phone:</strong> <a href="tel:${contactDetails.senderPhone}" style="color: #ef4444;">${contactDetails.senderPhone}</a></p>` : ''}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${contactDetails.from}?subject=Re: ${contactDetails.subject}" class="button">
                  📧 Reply to ${contactDetails.fromName}
                </a>
              </div>

              <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>Important:</strong> Please respond as soon as possible if you're available to help. Your donation could save a life! 🙏
                </p>
              </div>
            </div>
            
            <div style="background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px;">This email was sent through the BloodBond Platform</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Thank you for being a life saver! ❤️</p>
            </div>
          </div>
        </body>
        </html>
        `,
        priority: contactDetails.urgency === "emergency" ? "urgent" : contactDetails.urgency === "urgent" ? "high" : "normal"
    }),

    // Welcome email template
    welcome: (userDetails) => ({
        subject: `Welcome to BloodBond, ${userDetails.name}! 🩸`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .content { border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; padding: 30px; background: #f9fafb; }
            .feature-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ef4444; }
            .button { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩸 Welcome to BloodBond!</h1>
              <p style="margin: 0; font-size: 18px;">Thank you for joining our life-saving community</p>
            </div>
            <div class="content">
              <h2>Hello ${userDetails.name}! 👋</h2>
              <p>Welcome to BloodBond - where every drop counts and every donor matters!</p>
              
              <div class="feature-box">
                <h3>🔍 What you can do:</h3>
                <ul>
                  <li>Find blood donors in your area</li>
                  <li>Request blood for emergencies</li>
                  <li>Connect with hospitals and blood banks</li>
                  <li>Track your donation history</li>
                  <li>Get notified about urgent requests</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
                  🚀 Get Started
                </a>
              </div>

              <p>If you have any questions, feel free to reach out to us!</p>
              <p>Best regards,<br><strong>The BloodBond Team</strong> ❤️</p>
            </div>
          </div>
        </body>
        </html>
        `
    }),

    // Notification email template
    notification: (notificationDetails) => ({
        subject: notificationDetails.subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .content { border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; padding: 30px; background: #f9fafb; }
            .notification-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 ${notificationDetails.title}</h1>
            </div>
            <div class="content">
              <div class="notification-box">
                <p>${notificationDetails.message}</p>
                ${notificationDetails.actionUrl ? `
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${notificationDetails.actionUrl}" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                      ${notificationDetails.actionText || 'View Details'}
                    </a>
                  </div>
                ` : ''}
              </div>
              <p>Best regards,<br><strong>The BloodBond Team</strong></p>
            </div>
          </div>
        </body>
        </html>
        `
    })
};

// Specific email functions using templates
const sendBloodRequest = async (hospitalEmail, requestDetails) => {
    const template = emailTemplates.bloodRequest(requestDetails);
    return await sendEmail({
        to: hospitalEmail,
        subject: template.subject,
        html: template.html,
        priority: template.priority,
        replyTo: requestDetails.replyTo
    });
};

const sendDonorContactEmail = async (donorEmail, contactDetails) => {
    const template = emailTemplates.donorContact(contactDetails);
    return await sendEmail({
        to: donorEmail,
        subject: template.subject,
        html: template.html,
        priority: template.priority,
        replyTo: contactDetails.from
    });
};

const sendWelcomeEmail = async (userEmail, userDetails) => {
    const template = emailTemplates.welcome(userDetails);
    return await sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html
    });
};

const sendNotificationEmail = async (userEmail, notificationDetails) => {
    const template = emailTemplates.notification(notificationDetails);
    return await sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html
    });
};

module.exports = {
    sendEmail,
    sendBloodRequest,
    sendDonorContactEmail,
    sendWelcomeEmail,
    sendNotificationEmail,
    verifyEmailService,
    emailTemplates
};
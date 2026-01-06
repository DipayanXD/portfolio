require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Check if env vars are loaded
console.log('Loading environment variables...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

// Middleware
app.use(express.json());
app.use(cors());

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or configure host/port for others
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify Transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter Error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// API Endpoint to Send Email
app.post('/api/send-email', async (req, res) => {
    const { to, name, email, subject, message, cc } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing required fields (to, message)' });
    }

    const mailOptions = {
        from: `"${name || 'Portfolio User'}" <${process.env.EMAIL_USER}>`, // Sender address
        to: process.env.EMAIL_RECEIVER, // Admin email (You)
        replyTo: email, // Valid user email to reply to
        cc: cc,
        subject: `[Portfolio] ${subject || 'New Message'}`,
        text: `
    You have received a new message from your Portfolio OS:
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
        `,
        html: `
    <h3>New Message from Portfolio OS</h3>
    <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subject:</strong> ${subject}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent from ${email}`);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        // Send the actual error message back to client for debugging
        res.status(500).json({ success: false, error: error.message || 'Failed to send email' });
    }
});

// Export the app for Vercel (serverless)
module.exports = app;

// Only start the server if running directly (local dev)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

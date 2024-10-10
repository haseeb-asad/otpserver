const express = require('express');
const wbm = require('./wbm/src/index.js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Path to store the session flag
const sessionFlagPath = path.join(__dirname, 'session_started.flag');

// Function to check if the session has been started before
function isSessionStarted() {
    return fs.existsSync(sessionFlagPath);
}

// Function to mark the session as started
function markSessionStarted() {
    fs.writeFileSync(sessionFlagPath, 'true');
}

// Initialize WhatsApp Web session
async function initializeWhatsAppSession() {
    if (!isSessionStarted()) {
        console.log('Initializing WhatsApp Web session...');
        await wbm.start({showBrowser: false, qrCodeData: false, session: true});
        const message = `Tesging message`;
        await wbm.sendTo("+923237146391", message);
        markSessionStarted();
        console.log('WhatsApp Web session initialized and saved.');
    } else {
        console.log('Using existing WhatsApp Web session.');
    }
}

// API endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { phoneNumber, otpCode } = req.body;

    if (!phoneNumber || !otpCode) {
        return res.status(400).json({ error: 'Phone number and OTP code are required.' });
    }

    try {
        const message = `Your OTP code is: ${otpCode}. Please do not share this code with anyone.`;
        wbm.sendTo(phoneNumber, message);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Start the server
async function startServer() {
    try {
        await initializeWhatsAppSession();
        
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await wbm.end();
    process.exit(0);
});
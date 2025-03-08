const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Set up Express to handle API calls
const app = express();
app.use(express.json());

// Initialize the WhatsApp client with local authentication (to save login session)
const client = new Client({
    authStrategy: new LocalAuth()
});

// const authMiddleware = (req, res, next) => {
//     const uid = req.headers.authorization;
//     if (!uid || uid !== process.env.AUTH_TOKEN) {
//         return res.status(401).json({
//             status: 'error',
//             message: 'Authorization token required'
//         });
//     }
//     req.uid = uid;
//     next();
// };

// Generate and display QR code for WhatsApp login
client.on('qr', (qr) => {
    try {
        qrcode.generate(qr, { small: true });
        console.log('Scan the QR code to log in to WhatsApp');
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
});

// Log successful connection
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    // Start the message sending interval after the client is ready
    startMessageInterval();
});

// Log connection status
client.on('authenticated', () => {
    console.log('Authenticated successfully!');
});

// Handle WhatsApp client errors
client.on('disconnected', (reason) => {
    console.log('WhatsApp client disconnected:', reason);
    // Attempt to reconnect after a delay
    setTimeout(() => {
        try {
            client.initialize();
        } catch (error) {
            console.error('Error reinitializing WhatsApp client:', error);
        }
    }, 5000);
});

// Initialize WhatsApp client with error handling
try {
    client.initialize();
} catch (error) {
    console.error('Error initializing WhatsApp client:', error);
}

// Define the API endpoint to handle automation
app.post('/send-message', async (req, res) => {
    try {
        const { number, message } = req.body;
        
        if (!number || !message) {
            return res.status(400).send({ status: 'Error', message: 'Number and message are required' });
        }
        
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        // Send the message
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error: error.message });
    }
});

app.post('/request-otp', async (req, res) => {
    try {
        const { number, company, name } = req.body;
        
        if (!number || !company) {
            return res.status(400).send({ status: 'Error', message: 'Number and company are required' });
        }
        
        if (company.length > 15 || (name && name.length > 15)) {
            return res.status(400).send({ status: 'Company or name should not be larger than 15 characters' });
        }

        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        // generate random five digit number
        const otp = Math.floor(10000 + Math.random() * 90000);
        
        // Determine message format based on name
        const message = name && name.toLowerCase() !== 'default' 
            ? `Hey ${name}! Your ${company} OTP code is *${otp}*. Do Not share it with anyone!`
            : `Your OTP for ${company} is *${otp}*. Do Not share it with anyone!`;

        // Send the message
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Message sent successfully!', otp: otp});
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error: error.message });
    }
});

app.post('/send-otp', async (req, res) => {
    try {
        const { number, otp, company, name } = req.body;
        
        if (!number || !otp || !company) {
            return res.status(400).send({ status: 'Error', message: 'Number, OTP, and company are required' });
        }
        
        // validate if otp is a number 
        if (isNaN(otp)) {
            return res.status(400).send({ status: 'Invalid OTP' });
        }

        // validate company name and name should not be larger than 15 characters
        if (company.length > 15 || (name && name.length > 15)) {
            return res.status(400).send({ status: 'Company or name should not be larger than 15 characters' });
        }

        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        // Determine message format based on name
        const message = name && name.toLowerCase() !== 'default' 
            ? `Hey ${name}! Your ${company} OTP code is *${otp}*. Do Not share it with anyone!`
            : `Your OTP for ${company} is *${otp}*. Do Not share it with anyone!`;
            
        // Send the message
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error: error.message });
    }
});

app.post('/send-demo-message', async (req, res) => {
    try {
        const { number } = req.body;
        
        if (!number) {
            return res.status(400).send({ status: 'Error', message: 'Number is required' });
        }
        
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        const random = Math.floor(1000 + Math.random() * 9000);
        // Send the message
        await client.sendMessage(chatId, 'This is a demo message from nextOTP! Your randomly generated code is *' + random + '*');
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error: error.message });
    }
});

// Handle OPTIONS requests for CORS pre-flight
app.options('*', (req, res) => {
    res.status(200).end();
});

// Catch-all route handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).send({ status: 'error', message: 'Endpoint not found' });
});

// Function to send messages to specific numbers
async function sendScheduledMessages() {
    try {
        const contacts = [
            { number: '923237146391', name: 'Haseeb' }, // Replace with actual numbers
        ];
        
        for (const contact of contacts) {
            const message = `Server is running!`;
            const chatId = contact.number.includes('@c.us') ? contact.number : `${contact.number}@c.us`;

            try {
                await client.sendMessage(chatId, message);
                console.log(`Message sent to ${contact.name}: ${message}`);
            } catch (error) {
                console.error(`Error sending message to ${contact.name}:`, error);
                // Continue to next contact even if one fails
            }
        }
    } catch (error) {
        console.error('Error in scheduled message function:', error);
        // Don't throw the error to prevent crashing
    }
}

// Function to start the message sending interval
function startMessageInterval() {
    try {
        // Run immediately on startup
        sendScheduledMessages();

        // Set interval to send messages every hour (3600000 ms)
        setInterval(sendScheduledMessages, 3600000);
    } catch (error) {
        console.error('Error starting message interval:', error);
        // Try to restart the interval if it fails
        setTimeout(startMessageInterval, 5000);
    }
}

// Global error handler for unhandled exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Keep the server running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    // Keep the server running despite the rejection
});

// Set up the server to listen for API calls
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
    console.error('Server error:', error);
});

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
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to log in to WhatsApp');
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

// Start the WhatsApp client
client.initialize();

// Define the API endpoint to handle automation
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    try {
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        // Send the message
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error });
    }
});

app.post('/request-otp', async (req, res) => {
    const { number, company, name } = req.body;
    try {
        if (company.length > 15 || name.length > 15) {
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
        res.status(500).send({ status: 'Error sending message', error });
    }
});

app.post('/send-otp', async (req, res) => {
    const { number, otp, company, name } = req.body;
    try {
        // validate if otp is a number 
        if (isNaN(otp)) {
            return res.status(400).send({ status: 'Invalid OTP' });
        }

        // validate company name and name should not be larger than 15 characters
        if (company.length > 15 || name.length > 15) {
            return res.status(400).send({ status: 'Company or name should not be larger than 15 characters' });
        }

        const chatId = number.includes('@c.us') ? number : `${
            number
        }@c.us`;
        // Determine message format based on name
        const message = name && name.toLowerCase() !== 'default' 
            ? `Hey ${name}! Your ${company} OTP code is *${otp}*. Do Not share it with anyone!`
            : `Your OTP for ${company} is *${otp}*. Do Not share it with anyone!`;
            
        // Send the message
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {

        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error });
    }

});

app.post('/send-demo-message', async (req, res) => {
    const { number } = req.body;
    try {
        const chatId = number.includes('@c.us') ? number : `${
            number
        }@c.us`;
        const random = Math.floor(1000 + Math.random() * 9000);
        // Send the message
        await client.sendMessage(chatId, 'This is a demo message from nextOTP! Your randomly generated code is *' + random + '*');
        res.status(200).send({ status: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Error sending message', error });
    }
});

// Function to send messages to specific numbers
async function sendScheduledMessages() {
    const contacts = [
        { number: '923212346391', name: 'Haseeb' }, // Replace with actual numbers
    ];
    
    for (const contact of contacts) {
        const message = `Server is running!`;
        const chatId = contact.number.includes('@c.us') ? contact.number : `${contact.number}@c.us`;

        try {
            await client.sendMessage(chatId, message);
            console.log(`Message sent to ${contact.name}: ${message}`);
        } catch (error) {
            console.error(`Error sending message to ${contact.name}:`, error);
        }
    }
}

// Function to start the message sending interval
function startMessageInterval() {
    // Run immediately on startup
    sendScheduledMessages();

    // Set interval to send messages every hour (3600000 ms)
    setInterval(sendScheduledMessages, 3600000);
}

// Set up the server to listen for API calls
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

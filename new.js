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

// Generate and display QR code for WhatsApp login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to log in to WhatsApp');
});

// Log successful connection
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
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

// Set up the server to listen for API calls
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

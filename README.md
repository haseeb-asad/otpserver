# WhatsApp Automation API

This project provides a Node.js server application that utilizes the `whatsapp-web.js` library to automate WhatsApp messaging through a web API. It includes functionality for sending messages, generating OTPs, and scheduling messages to specific contacts.

## Features

- **Login with QR Code**: Scan a QR code to log in to WhatsApp.
- **Send Messages**: API endpoint to send messages to specific WhatsApp numbers.
- **Generate and Send OTP**: Generate OTPs and send them to specified numbers with custom messages.
- **Scheduled Messaging**: Automatically send messages at scheduled intervals.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/whatsapp-automation-api.git
cd whatsapp-automation-api
```

Install the required dependencies:

```bash
npm install
```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. Scan the QR code displayed in the console with your WhatsApp mobile app to authenticate.

3. Use the provided API endpoints to send messages and OTPs:

    - **POST** `/send-message` - Send a standard message.
    - **POST** `/send-otp` - Send a custom OTP message.
    - **POST** `/send-demo-message` - Send a demo message with a random code.

## API Documentation

- **Send Message**
  - **URL**: `/send-message`
  - **Method**: `POST`
  - **Data Params**:
    ```json
    {
      "number": "phone_number",
      "message": "Your message here"
    }
    ```

- **Generate OTP**
  - **URL**: `/request-otp`
  - **Method**: `POST`
  - **Data Params**:
    ```json
    {
      "number": "phone_number",
      "company": "Your Company",
      "name": "Recipient's Name"
    }
    ```

- **Send Scheduled Message**
  - **URL**: `/send-scheduled-message`
  - **Method**: `POST`
  - **Data Params**:
    ```json
    {
      "number": "phone_number"
    }
    ```

## Environment Variables

Ensure you set the following environment variables before running the application:

- `AUTH_TOKEN` - Your authentication token for API requests.
- `PORT` - The port number on which the server will listen.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

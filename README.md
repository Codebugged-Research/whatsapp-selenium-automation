# WhatsApp Sender (Windows)

A local WhatsApp automation application built with Selenium and Electron GUI. This tool reads phone numbers and messages from a CSV file and automatically sends WhatsApp messages through WhatsApp Web.

## Features

- Automated WhatsApp message sending
- CSV file support for bulk messaging
- ⏱Configurable delays between messages
- Electron-based GUI
- Local execution - your data stays on your machine

## Prerequisites

Before running this application, ensure you have the following installed:

1. **Node.js** (v18 or later) - [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Google Chrome browser** (Selenium uses Chrome for automation)
4. A **CSV file** with your contacts and messages

## CSV File Format

Create a file named `whsend.csv` in the project root directory with the following format:

```csv
WHATSAPP,MESSAGE
919999999999,Hello from bot!
918888888888,Your custom message here
```

**Important Notes:**
- Include the country code in phone numbers (e.g., `91` for India)
- If no country code is provided, the script will automatically prepend `91`
- Make sure there are no spaces in the phone numbers

## Installation

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd whatsapp-sender
```

### 2. Install Dependencies

Open PowerShell or Command Prompt and navigate to the project folder:

```bash
cd path\to\whatsapp-sender
npm install
```

## Configuration

The application comes with default settings in `config.js`:

```javascript
module.exports = {
  csvFile: "whsend.csv",        // CSV file name
  minDelay: 10000,              // Minimum delay between messages (ms)
  maxDelay: 20000,              // Maximum delay between messages (ms)
  waitAfterLogin: 12000,        // Wait time after opening WhatsApp Web (ms)
  waitAfterTyping: 3000         // Wait time after typing message (ms)
};
```

You can adjust these delays based on your needs:
- Increase delays to appear more natural and avoid detection
- Decrease delays to send messages faster (not recommended)

## Building the Windows Executable

The project uses Electron Builder to create a Windows installer (`.exe`).

### Build Command

```bash
npm run dist
```

This will create a Windows installer in the `dist/` folder.

## Running the Application

### Option 1: Run from Installer

1. Navigate to the `dist/` folder after building
2. Run the installer (e.g., `WhatsAppSender Setup.exe`)
3. Install the application
4. Launch the installed app from your Start Menu or Desktop

### Option 2: Run from Source (Development)

```bash
npm start
```

## How It Works

1. **Launch**: The application opens Chrome browser using Selenium
2. **Login**: Navigate to WhatsApp Web and scan the QR code (if not already logged in)
3. **Processing**: The app reads contacts and messages from `whsend.csv`
4. **Sending**: Messages are sent automatically with random delays between each message
5. **Completion**: Once all messages are sent, the browser closes

## Usage Tips

### First Time Setup
- The first time you run the app, you'll need to scan the WhatsApp Web QR code
- Keep your phone connected to the internet
- Make sure WhatsApp is active on your phone

### Best Practices
- Test with a small CSV file first (2-3 contacts)
- Don't send too many messages too quickly (risk of account ban)
- Use realistic delays (10-20 seconds between messages)
- Avoid sending spam or unsolicited messages

### Troubleshooting
- **QR Code not appearing**: Wait for the configured `waitAfterLogin` time
- **Messages not sending**: Check if phone numbers have proper country codes
- **Browser closes early**: Increase delay settings in `config.js`
- **Chrome driver issues**: Make sure Chrome browser is up to date

## Project Structure

```
whatsapp-sender/
├── src/
│   ├── openChat.js      # Opens WhatsApp chat
│   └── message.js       # Types and sends messages
├── config.js            # Configuration settings
├── index.js             # Main application logic
├── start.cjs            # Entry point
├── package.json         # Dependencies and scripts
├── whsend.csv          # Your contacts CSV file
└── README.md           # This file
```

## Development

### Available Scripts

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build Windows executable
npm run dist



## License

[Add your license here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review your `config.js` settings
3. Ensure your CSV file is properly formatted
4. Make sure all prerequisites are installed

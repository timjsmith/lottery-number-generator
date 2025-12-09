# Lottery Number Generator

A full-stack application for generating lottery numbers based on custom string inputs and previous winning numbers.

## Features

- React frontend with Vite for fast development
- Node.js/Express backend server
- Lottery number generation algorithm based on string values and previous winning numbers
- Preset configurations for popular lottery games (Powerball, Mega Millions, etc.)
- Clean, modern UI with responsive design

## Project Structure

```
lottery-app/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/          # Node.js Express backend
│   ├── server.js
│   ├── lottery-picker.js
│   └── package.json
└── package.json     # Root package.json with convenience scripts
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies for both client and server:

```bash
cd lottery-app
npm run install:all
```

Or install them separately:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Running the Application

You need to run both the client and server in separate terminals.

### Terminal 1 - Start the Server

```bash
cd lottery-app
npm run start:server
```

The server will run on http://localhost:3001

### Terminal 2 - Start the Client

```bash
cd lottery-app
npm run start:client
```

The client will run on http://localhost:3000

## Usage

1. Open your browser to http://localhost:3000
2. Choose a preset lottery game or configure custom parameters
3. Enter a generation string (any text you want to use as a seed)
4. Enter the last winning numbers (comma-separated)
5. Click "Generate Numbers" to get your lottery picks

## How It Works

The lottery picker algorithm:

1. Converts your input string to numeric values based on letter positions (a=1, b=2, etc.)
2. Sums the previous winning numbers
3. Uses these values to determine how many random number sets to generate
4. Tracks the frequency of each number across all generated sets
5. Returns the most frequently occurring numbers as your picks

## API Endpoints

### POST /api/generate

Generate lottery numbers based on input parameters.

**Request Body:**
```json
{
  "lastWinningNumbers": [8, 32, 52, 56, 64, 23],
  "genStrings": ["Your generation string here"],
  "regularPickTotal": 5,
  "regularPickMax": 70,
  "pbPickTotal": 1,
  "pbPickMax": 25,
  "additionalGenTotal": 0
}
```

**Response:**
```json
{
  "winingNumbers": [12, 23, 34, 45, 56],
  "winningPB": [15]
}
```

### GET /api/health

Health check endpoint.

## Development

- Client uses Vite with HMR (Hot Module Replacement)
- Server can be run with `--watch` flag for auto-restart on changes
- Client proxies API requests to the server during development

## License

ISC

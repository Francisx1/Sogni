# D&D Character Generator

A web application that generates D&D character cards using Sogni AI.

## Features

- Generate D&D character images based on attributes
- Interactive character sheet
- Mobile-responsive design
- Save generated images
- Build character sheets with stats

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Sogni AI credentials:
```bash
SOGNI_USERNAME=your-username
SOGNI_PASSWORD=your-password
SOGNI_APPID=your-app-id
PORT=3000
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000

## Deployment

This app is configured for easy deployment on Vercel.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

Required environment variables:
- `SOGNI_USERNAME` - Your Sogni AI username
- `SOGNI_PASSWORD` - Your Sogni AI password
- `SOGNI_APPID` - Your Sogni AI app ID (optional)
- `PORT` - Server port (optional, defaults to 3000)

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Sogni AI API
- **Deployment**: Vercel

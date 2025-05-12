# MyTuner

This is a web application designed to help guitar players tune their instruments and help them practice for free. It uses real-time pitch detection and offers customizable themes and tunings.

**Try it out here:** [https://my-tuner.vercel.app/](https://my-tuner.vercel.app/)

## Features

- Real-time pitch detection using the Web Audio API
- Custom theme support (background, font color, guitar image)
- Built in metronome with different time signatures
- Responsive design for desktop and mobile
- Custom user defined tunings that can be saved and loaded

## Technologies Used

**Frontend:**
- React
- TypeScript
- CSS

**Backend:**
- Node.js with Express
- PostgreSQL

## Project Structure
```plaintext
guitar-tuner/
├── client/   # React frontend
└── server/   # Backend API
```

## Getting Started

You can use the app directly at:  [https://my-tuner.vercel.app/](https://my-tuner.vercel.app/)

If you want to run the project locally for development or testing, follow the steps below.

### Prerequisites

- Node.js and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CalebSutherland/MyTuner.git
cd MyTuner
```

2. Install and start the frontend:

```bash
cd client
npm install
npm start
```

3. Install and start the backend:

```bash
cd ../server
npm install
npm run dev
```

## Environment Variables

Add a .env file in the server/ directory with required values like:

```env
PORT=5000
JWT_SECRET=yourjwtsecret
DATABASE_URL=yourdatabaseurl
```
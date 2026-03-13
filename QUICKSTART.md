# 🎵 SoundCloud Rater - Quick Start

A full-stack app for you and your friends to share and rate SoundCloud sets!

## Features

✨ **Post SoundCloud Links** - Share your favorite sets
⭐ **Rate Sets** - 1-5 star rating system
👂 **Track Listening** - Mark which sets you've listened to
📊 **Sentiment Analysis** - Automatically calculates average ratings and overall sentiment
👥 **Simple Auth** - Just enter your name, no passwords needed

## Getting Started

### Quick Start (Easiest)

```bash
cd soundcloud-rater
./start.sh
```

This starts both the backend and frontend servers!

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the App

Open your browser to: **http://localhost:3000**

## How to Use

1. **Enter your name** when prompted
2. **Add a set** with title and SoundCloud URL
3. **Rate sets** by clicking the stars (1-5)
4. **Mark as listened** if you've heard the whole set
5. **See sentiment** - average ratings and overall vibe for each set

## Customizing the UI

The app uses React components for easy customization:

- **`frontend/src/index.css`** - Main styling (colors, fonts, layout)
- **`frontend/src/components/SetCard.jsx`** - Individual set display
- **`frontend/src/components/RatingStars.jsx`** - Star rating component
- **`frontend/src/components/AddSetForm.jsx`** - Form for adding new sets
- **`frontend/src/App.jsx`** - Main app layout and header

### Quick Style Changes

Want a different color scheme? Edit `frontend/src/index.css`:

```css
/* Line 12 - Change background gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Line 79 - Change button colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (stored as `backend/soundcloud-rater.db`)
- **Styling**: Pure CSS (easy to customize!)

## Data

All ratings and sets are stored in `backend/soundcloud-rater.db`. This file persists between sessions, so your data is safe!

---

**Have fun rating sets!** 🎧

# 🎵 SoundCloud Rater

A beautiful, shareable app for rating and discussing SoundCloud sets with friends!

## ✨ Features

- 🔗 **Share SoundCloud Links** - Post your favorite sets
- ⭐ **Rate with Stars** - 1-5 star rating system
- 👂 **Track Listening** - Mark which sets you've actually listened to
- 📊 **Sentiment Analysis** - Automatic average ratings and vibe detection
- 👥 **Simple Auth** - Just enter your name, no passwords
- 🚀 **Zero Install Sharing** - Deploy once, share with anyone

## 🚀 Quick Start (Local)

```bash
./start.sh
```

Then open http://localhost:3000

See [QUICKSTART.md](QUICKSTART.md) for detailed local setup.

## 🌐 Deploy for Sharing (No Install Required!)

Make your app accessible to anyone via a public URL:

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "SoundCloud Rater"
gh repo create soundcloud-rater --public --source=. --push

# 2. Deploy to Railway
# Go to railway.app → New Project → Deploy from GitHub
# Select your repo → Railway deploys automatically!

# 3. Share your URL with friends!
```

See [DEPLOY.md](DEPLOY.md) for complete deployment instructions.

## 🎨 Customizing the UI

All styling is in pure CSS - super easy to customize!

**Main files:**
- `frontend/src/index.css` - Colors, fonts, layout
- `frontend/src/components/SetCard.jsx` - Set display
- `frontend/src/components/RatingStars.jsx` - Star ratings

**Quick color changes:**
```css
/* frontend/src/index.css - Line 12 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📊 How Sentiment Works

The app quantifies ratings to show overall sentiment:

- **4.5+ stars** = 🔥 Fire!
- **4.0+ stars** = ✨ Excellent
- **3.5+ stars** = 👍 Good
- **3.0+ stars** = 😐 Okay
- **Below 3** = 👎 Not great

Plus tracks:
- Average rating across all reviewers
- Total number of ratings
- How many people have listened

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Deployment**: Railway (recommended)

## 📝 License

MIT - Use this however you want!

---

**Built with Claude Code** 🤖

# 🚀 Deploy to Railway - No Install Required!

Make your SoundCloud Rater accessible to anyone via a public URL in under 5 minutes.

## Quick Deploy Steps

### 1. Push to GitHub

```bash
cd soundcloud-rater
git init
git add .
git commit -m "Initial commit - SoundCloud Rater"
gh repo create soundcloud-rater --public --source=. --push
```

Or create a repo manually on GitHub and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/soundcloud-rater.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `soundcloud-rater` repository
6. Railway will automatically:
   - Detect the app configuration
   - Install dependencies
   - Build the frontend
   - Start the backend server
   - Assign you a public URL

### 3. Get Your Public URL

- Once deployed, Railway will show your app URL (like `soundcloud-rater-production.up.railway.app`)
- Share this URL with your friends!
- The app is now live with no install required

### 4. Add Persistent Storage (Important!)

By default, Railway's filesystem is ephemeral. To keep your ratings between deploys:

1. In your Railway project, go to **Settings** → **Volumes**
2. Click **"Add Volume"**
3. Set:
   - **Mount Path**: `/app/backend`
   - **Size**: 1GB (more than enough)
4. Click **"Add"**
5. Redeploy your app

This ensures your SQLite database persists!

## That's It!

Your friends can now:
- Visit your Railway URL
- Enter their name
- Post SoundCloud links
- Rate sets
- See sentiment analysis

No installation, no terminal commands - just share the link! 🎵

## Optional: Custom Domain

Want a custom domain like `beats.yourname.com`?

1. In Railway project → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add your domain
4. Update your DNS records as shown

## Free Tier Limits

Railway's free tier includes:
- $5 credit/month (usually enough for hobby projects)
- Automatic SSL
- Global CDN

Your app will sleep after inactivity but wake up instantly when accessed.

## Troubleshooting

**App won't start?**
- Check the deployment logs in Railway dashboard
- Ensure Node version is 18+ in `package.json` engines

**Database resets on deploy?**
- Make sure you added a persistent volume (step 4 above)

**App is slow?**
- Railway free tier has some cold starts
- Upgrade to hobby plan for always-on service

---

**Your app is now live and shareable!** 🚀

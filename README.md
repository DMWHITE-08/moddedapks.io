# ModdedApks.io

A static, no-backend website for showcasing and downloading your own Android apps.

- **`index.html`** — Browse apps (grid of your published apps)
- **`app.html`** — App detail + up to 3 download links (`app.html?id=orbitlist`)
- **`admin.html`** — Hidden admin panel to add / edit / delete apps
- **`todo.html`** — To-Do list with local storage functionality

## Admin access

- Press **Alt + A** on any public page to jump to the admin panel.
- Default password: `arlinalbin`
- You can change it from inside the admin panel ("Change password").

## To-Do List Features

- ✅ Add, complete, and delete tasks
- 🎯 Filter tasks (All, Active, Completed)
- 💾 Everything saved in browser's localStorage
- 📱 Fully responsive design
- ⏰ Task timestamps

## ⚠️ Important limitation — read this before you rely on it

This site has **no server or database**. Everything the admin panel adds is saved in your **browser's `localStorage`**, which means:

- Apps you add in the admin panel only show up **in that same browser, on that same device**. Other visitors to your live GitHub Pages site will **not** see apps you added — they'll only see the 3 sample apps baked into `assets/store.js`.
- Clearing your browser data / using a different browser / incognito mode will lose anything you added.
- To-Do tasks are also stored locally and won't sync across devices or browsers.

**If you want apps you add through the admin panel to be visible to everyone who visits the site**, you have two options:
1. **Simplest**: edit the `SEED_APPS` array directly in `assets/store.js` and commit that to GitHub. This is the only way content shows up for all visitors on a purely static site.
2. **Real solution**: add a small backend (e.g. a free tier on Supabase, Firebase, or a tiny Cloudflare Worker + KV) so `getApps()` / `saveApps()` read and write to a shared database instead of `localStorage`. Ask me if you'd like this built — it's a bigger change but it's what makes the admin panel actually publish apps for everyone.

## Security note on the password

The password is checked client-side (hashed with SHA-256 and compared in the browser). This keeps a casual visitor from stumbling into the admin panel, but **anyone who opens the browser dev tools can see the site's JavaScript** — this is not bank-grade security. Don't store anything truly sensitive here. If this ever needs to be properly secure, it needs a real backend with server-side authentication.

## Deploying to GitHub

```bash
cd moddedapks
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/moddedapks.io.git
git push -u origin main
```

Then in your repo: **Settings → Pages → Deploy from branch → main → / (root)**.
Your site will be live at `https://<your-username>.github.io/moddedapks.io/` (or your custom domain if you attach one under Settings → Pages → Custom domain).

## Adding real APK files

Right now the download buttons point to `#` placeholders (or whatever URL you enter in the admin panel). To host actual `.apk` files:
- Put them in an `apks/` folder in this repo and link to e.g. `apks/orbitlist.apk`, **or**
- Host them externally (e.g. a GitHub Release asset) and paste that URL into the download link field in the admin panel.

GitHub Pages will serve `.apk` files as downloads automatically.
QUICK START — YouTube Automation Master v3 (Windows + GitHub + espeak)
=====================================================================

This quick guide walks you through:
1) Local testing on Windows (PowerShell)
2) Uploading to GitHub and enabling Actions

A. Local testing (Windows 10/11) — PowerShell (Admin recommended)
----------------------------------------------------------------
1. Install Chocolatey (if you don't have it) — open PowerShell as Administrator:
   Set-ExecutionPolicy Bypass -Scope Process -Force; `
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
   iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

2. Install system packages:
   choco install -y ffmpeg imagemagick
   (espeak may not be available on choco; if missing, install via WSL or MSYS2 or run on a Linux runner)

3. Install Node.js 18+ (recommended via installer or choco):
   choco install -y nodejs-lts

4. Open Git Bash, WSL, or PowerShell in the project folder and run:
   ./setup.sh

5. Create a `.env` file in the project root (or set environment variables).
   Example `.env` entries (do NOT commit these):
     OPENAI_API_KEY=sk-...
     YT_CLIENT_ID=...
     YT_CLIENT_SECRET=...
     YT_REFRESH_TOKEN=...
     YT_CHANNEL_ID=...

6. Test locally:
   node runner_generate_and_upload_v3.js

B. Obtaining a YouTube refresh token (locally)
----------------------------------------------
1. In terminal set your client ID & secret:
   export YT_CLIENT_ID="your-client-id"
   export YT_CLIENT_SECRET="your-client-secret"
   export PORT=3000

2. Run:
   node get_refresh_token.js
   Authorize and copy the printed refresh_token into your .env or GitHub Secrets.

C. Uploading to GitHub & enabling Actions
-----------------------------------------
1. Create a new GitHub repo and upload all files at repo root.
2. Add these Secrets in Settings → Secrets → Actions:
   - OPENAI_API_KEY
   - YT_CLIENT_ID
   - YT_CLIENT_SECRET
   - YT_REFRESH_TOKEN
   - YT_CHANNEL_ID (optional)

3. Trigger workflow manually or wait for scheduled runs at 02:00, 08:00, 14:00, 20:00 UTC.

-- End of Quick Start --

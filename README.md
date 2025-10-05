# YouTube Automation — Master v3 (GitHub + Local) — espeak TTS

This repository generates and uploads 1 video per run, scheduled 4 times per day (total 4 videos/day).
It uses OpenAI for scripts & metadata and `espeak` for offline TTS. Ready to upload to GitHub.

Contents:
- runner_generate_and_upload_v3.js
- get_refresh_token.js (OAuth helper)
- setup.sh (installs system deps and npm packages)
- .github/workflows/auto-post.yml (4 runs/day)
- src/ modules (generate story/meta/voice/image/video/thumbnail/upload)
- README_QUICK_START.txt (Windows + GitHub instructions)

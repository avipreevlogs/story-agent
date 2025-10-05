/*
OAuth helper: run locally to obtain a YouTube OAuth refresh token.
Usage:
  export YT_CLIENT_ID=...
  export YT_CLIENT_SECRET=...
  export PORT=3000
  node get_refresh_token.js
*/
const express = require('express');
const {google} = require('googleapis');
const open = require('open');

const CLIENT_ID = process.env.YT_CLIENT_ID;
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

if(!CLIENT_ID || !CLIENT_SECRET){
  console.error('Set YT_CLIENT_ID and YT_CLIENT_SECRET as env vars.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  `http://localhost:${PORT}/oauth2callback`
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

const app = express();

app.get('/', (req,res)=> {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.send(`<p>Open this URL to start OAuth: <a href="${url}" target="_blank">Authorize</a></p><p>Or check console — the script also opened it.</p>`);
});

app.get('/oauth2callback', async (req,res) => {
  const code = req.query.code;
  if(!code) return res.send('No code found in query');
  try{
    const {tokens} = await oauth2Client.getToken(code);
    console.log('Tokens:', tokens);
    res.send(`<pre>Success! Check terminal for the refresh_token.\nRefresh token:\n${tokens.refresh_token}</pre>`);
    console.log('\n--- COPY THIS REFRESH TOKEN ---\n', tokens.refresh_token);
    process.exit(0);
  }catch(e){
    console.error('Token exchange error', e);
    res.send('Token exchange error. Check terminal.');
  }
});

app.listen(PORT, ()=> {
  const url = `http://localhost:${PORT}`;
  console.log('OAuth helper running at', url);
  const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
  console.log('Opening browser to:', authUrl);
  open(authUrl).catch(()=>console.log('Open failed; please open the URL manually'));
});

/*
Runner v3: generates and uploads 1 video per run.
Skips gracefully if required env vars/secrets are missing.
*/
const path = require('path');
const fs = require('fs');
const gen = require('./src/generate_story');
const meta = require('./src/generate_meta');
const voice = require('./src/generate_voice');
const img = require('./src/generate_image');
const maker = require('./src/make_video');
const thumb = require('./src/generate_thumbnail');
const upload = require('./src/upload');

function checkEnv(){
  const required = ['OPENAI_API_KEY','YT_CLIENT_ID','YT_CLIENT_SECRET','YT_REFRESH_TOKEN'];
  const missing = required.filter(k=>!process.env[k]);
  if(missing.length){
    console.log('Missing required env vars/secrets:', missing.join(', '));
    return false;
  }
  return true;
}

async function main(){
  if(!checkEnv()){
    console.log('Skipping run due to missing secrets. Exiting successfully.');
    process.exit(0);
  }

  const outDir = 'outputs';
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  console.log('Generating seed...');
  const seed = await gen.generateSeed();
  console.log('Seed:', seed);

  try{
    const base = seed.replace(/[^a-z0-9]/ig, '-').toLowerCase().slice(0,40);

    const script = await gen.generateStoryForSeed(seed);
    fs.writeFileSync(path.join(outDir, `${base}.txt`), script, 'utf8');

    const metaObj = await meta.generateMetaFromSeed(seed);
    fs.writeFileSync(path.join(outDir, `${base}.meta.json`), JSON.stringify(metaObj, null, 2));

    const imagePath = path.join(outDir, `${base}.png`);
    img.createSlideImage(seed, imagePath);

    const audioPath = path.join(outDir, `${base}.wav`);
    voice.textToSpeechEspeak(script, audioPath);

    const videoPath = path.join(outDir, `${base}.mp4`);
    maker.makeVideoFromImageAndAudio(imagePath, audioPath, videoPath);

    const thumbPath = path.join(outDir, `${base}-thumb.jpg`);
    thumb.makeThumbnailFromImage(imagePath, thumbPath, metaObj.title || seed);

    console.log('Uploading', videoPath);
    const res = await upload.uploadVideo({
      filePath: videoPath,
      title: metaObj.title,
      description: metaObj.description,
      tags: metaObj.tags,
      thumbnailPath: thumbPath
    });
    console.log('Uploaded:', res.videoId);

  }catch(err){
    console.error('Error during generation/upload:', err);
  }

  console.log('Done.');
}

main();

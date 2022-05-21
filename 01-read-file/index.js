const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const txt_path = path.join(__dirname,'text.txt');

const readStream = fs.createReadStream(txt_path, 'utf-8');

// let data = '';

/* readStream.on('data', (chunk) => {
  data += chunk;
  stdout.write(chunk);
});*/

readStream.pipe(stdout).on('error', () => {
  console.log('error');
  process.exit();
});


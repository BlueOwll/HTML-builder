const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin } = require('process');

const txt_path = path.join(__dirname,'text.txt');

const rl = readline.createInterface(stdin);
const writeStream = fs.createWriteStream(txt_path);

console.log('enter something');
rl.on('line', (data) => {
  if (data.toString() == 'exit') {
    writeStream.close();
    rl.close();
  } else {
    writeStream.write(data.toString() + '\n');
  }
});
rl.on('SIGINT',()=> {
  writeStream.close(); 
  rl.close();  
});
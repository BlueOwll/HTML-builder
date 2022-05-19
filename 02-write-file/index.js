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
    //console.log('It was nice to meet you!');
    writeStream.close();
    rl.close();
  } else {
    writeStream.write(data.toString() + '\n');
  }
});/*
rl.on('SIGINT',()=> {
  console.log('It was nice to meet you!');
  writeStream.close(); 
  rl.close();  
});*/

rl.on('SIGINT', () => {
  rl.question('Are you sure you want to exit? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
rl.on('close', () => console.log('It was nice to meet you!'));
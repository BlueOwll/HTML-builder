const path = require('path');
// const fs = require('fs');
const {mkdir, readdir,copyFile, rm} = require('fs/promises');


async function copyDir(src, dest){
  if((typeof src) != 'string'){
    throw new Error('Wrong dir name');
  }

  const srcDirPath = path.join(__dirname,src);
  const destDirPath = path.join(__dirname,dest);


  let dirList;
  try{
    console.log('reading dir' +srcDirPath);
    dirList = await readdir(srcDirPath,{withFileTypes:true});
  }catch{
    console.log('there is no dir');
    return;
  }

  try{
    await rm(destDirPath, {recursive: true});
  }catch(err) {
    console.log(err);
  }


  try{
    await mkdir(destDirPath, {recursive: true});

    for (let str of dirList){
      console.log(str.name + ' dir? ' + str.isDirectory());
      if(str.isDirectory()){
        await copyDir(path.join(src, str.name), path.join(dest, str.name));
      } else{
        const srcFilePath = path.join(srcDirPath, str.name);
        const destFilePath = path.join(destDirPath, str.name);
        await copyFile(srcFilePath,destFilePath);
      }
    }
  }catch{
    console.log('something goes wrong');
  }
}
copyDir('files','files-copy');


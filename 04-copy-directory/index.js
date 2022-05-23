const path = require('path');
const {mkdir, readdir,copyFile, rm} = require('fs/promises');


async function copyDir(src, dest){
  if((typeof src) != 'string'){
    throw new Error('Wrong src dir name');
  }

  const srcDirPath = path.join(__dirname,src);
  const destDirPath = path.join(__dirname,dest);


  let dirList;
  try{
    // console.log('reading dir' +srcDirPath);
    dirList = await readdir(srcDirPath,{withFileTypes:true});
  }catch{
    throw new Error('there is no dir to copy');
  }

  try{
    await rm(destDirPath,  {force: true, recursive: true, maxRetries: 10});
  }catch(err) {
    console.log(destDirPath);
    throw new Error('It is impossible to clear dist dir, please close Live Server and try again');
  }
  //console.log('go on ' + destDirPath);

  try{
    await mkdir(destDirPath, {recursive: true});

    for (const str of dirList){
      //console.log(str.name + ' dir? ' + str.isDirectory());
      if(str.isDirectory()){
        await copyDir(path.join(src, str.name), path.join(dest, str.name));
      } else{
        const srcFilePath = path.join(srcDirPath, str.name);
        const destFilePath = path.join(destDirPath, str.name);
        console.log('copying file ' + str.name);
        await copyFile(srcFilePath,destFilePath);
      }
    }
  }catch (e) {
    throw new Error('Copy error: '+ e.message);
  }
}

copyDir('files','files-copy').catch(err => console.log('Something goes wrong: ' + err.message));


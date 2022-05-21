

const { readdir,open, readFile, rm} = require('fs/promises');
const path = require('path');

async function bundleCSS(cssPath, distPath) {
  const cssDirPath = path.join(__dirname, cssPath);
  const destDirPath = path.join(__dirname, distPath);
  const bundleFilePath = path.join(destDirPath, 'bundle.css');
  
  /*
    rm(distDirPath, {recursive: true}).catch(() => console.log('first time'))
      .then(()=>{
        console.log('before mkdir');
        return mkdir(distDirPath, {recursive: true});
      })
      .catch(() =>{
        console.log('something goes wrong');
      });
    console.log('sync after first chain');
    readdir(cssDirPath, {withFileTypes: true}).catch(()=> console.log('No such dir'))
      .then((dirList) => console.log('then after readdir ' + dirList.join(' = ')));*/
  let dirList;

  try {
    dirList = await readdir(cssDirPath, { withFileTypes: true });
  } catch {
    console.log('there is no dir ' + cssPath);
    return;
  }

  try {
    await readdir(destDirPath);
  } catch (err) {
    console.log('there is no dir ' + distPath);
    return;
  }
  try{
    await rm(bundleFilePath);
  }catch{
    console.log('nothing to delete');
  }

  try {
    const bundleFileHandle = await open(bundleFilePath, 'a');

    for (const file of dirList){
      console.log('for ' + file.name + ' ' +  path.extname(file.name).toLowerCase());
      if ((file.isFile) && (path.extname(file.name).toLowerCase() == '.css')){
        const cssFilePath = path.join(cssDirPath, file.name);
        const cssContent = await readFile(cssFilePath);
        console.log('for css' + cssFilePath);
        await bundleFileHandle.appendFile(cssContent);
        await bundleFileHandle.appendFile('\n');
      }
    }
  }catch{
    console.log('something goes wrong');
  }
}

bundleCSS('styles','project-dist');
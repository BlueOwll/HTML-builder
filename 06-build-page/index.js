const { rm, mkdir,readFile, writeFile , readdir, copyFile} = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function mkProjectDist(dirPath){
  const distPath = path.join(__dirname,dirPath);
  try{
    await rm(distPath,  {force: true, recursive: true, maxRetries: 10});
  }catch{
    throw new Error('It is impossible to clear dist dir, please close Live Server and try again');
  }
  
  try{
    await mkdir(distPath, {recursive: true});
  } catch{
    throw new Error('Error while making dir project-dist');
    
  }
}

async function buildHTML(dirPath){
  const distPath = path.join(__dirname,dirPath);
  let template;
  try{
    template = await readFile(path.join(__dirname, 'template.html'), {encoding: 'utf8'});
  } catch (e) {
    throw new Error('There is no template file or ' + e.message);    
  }
  
  //console.log(template.match(/{{([A-Za-z0-9-])+}}/gi));
  for (const templateExp of template.match(/{{([A-Za-z0-9-])+}}/gi) ){
    const compName = templateExp.slice(2,-2);
    //console.log(compName);
    try{
      const compContent = await readFile(path.join(__dirname, 'components', compName +'.html'), {encoding: 'utf8'});
      //console.log(compContent);
      template = template.replace(templateExp, compContent);
      //console.log(template);
    }catch{
      console.log(`there is no component for template ${compName}`);
    }
  }
  try{
    await writeFile(path.join(distPath, 'index.html'), template);
  } catch{
    throw new Error('Writing file index.html error');
  }
   
  //console.log(templateArr); 
  
}

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

async function bundleCSS(cssPath, distPath, bundleName =  'bundle.css'){
  const cssDirPath = path.join(__dirname, cssPath);
  const destDirPath = path.join(__dirname, distPath);
  const bundleFilePath = path.join(destDirPath, bundleName); 

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

  const writeStr = fs.createWriteStream(bundleFilePath);

  for (const file of dirList){
    //console.log('for ' + file.name + ' ' +  path.extname(file.name).toLowerCase());
    if ((file.isFile) && (path.extname(file.name).toLowerCase() == '.css')){
      const cssFilePath = path.join(cssDirPath, file.name);
      const readStr = fs.createReadStream(cssFilePath);
      //console.log('for css' + cssFilePath);
      readStr.pipe(writeStr).on('error', () => {
        console.log('writing error for file ' + file);
        
      });
    }
  }
}
mkProjectDist('project-dist')
  .then(() => buildHTML('project-dist'))
  .then(() => copyDir('assets', path.join('project-dist','assets')))
  .then(() => bundleCSS('styles','project-dist', 'style.css'))
  .catch((e) => console.log(e.message));

/*
async function buildProject(){

  force: true, 
  await mkProjectDist('project-dist');
  await buildHTML('project-dist');
  await copyDir('assets', path.join('project-dist','assets'));
  await bundleCSS('styles','project-dist', 'style.css');
}

buildProject();
*/

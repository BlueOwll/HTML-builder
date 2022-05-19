const {readdir, stat} = require('fs/promises');

const path = require('path');

async function main(){
  const dirPath = path.join(__dirname, 'secret-folder');
  console.log(dirPath);

  let template = '';
  try{
    const dirList = await readdir(dirPath);

    for (let str of dirList){
      //console.log(str);
      const filePath = path.join(dirPath, str);
      
      const currStat = await stat(filePath);
      if (currStat.isFile()) {
        const ext = path.extname(filePath);
        if (ext){
          const arr = str.split('');
          arr.splice(str.indexOf('.'), 1, ' - ');
          template += arr.join('') ;
        } else {
          template += str;
        }
        template += ' - ' + currStat.size  + ' B';
        console.log(template);
        template = '';
      }
    }
  } catch (err) {
    console.log('Something goes wrong: Error', err);
    return;
  }
  
  
  //for
}

main();




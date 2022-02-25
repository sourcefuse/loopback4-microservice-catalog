const path = require('path');
const fs = require("fs");

function changeFileName(datasourceName){
    console.log(process.cwd());
    let oldPath = path.join(process.cwd(),"src/datasource/datasource.ts");
    let newPath = path.join(process.cwd(),`src/datasource/${datasourceName}.datasource.ts`);
    console.log(oldPath);
    console.log(newPath);
    fs.renameSync(oldPath,newPath);
}

module.exports = changeFileName;

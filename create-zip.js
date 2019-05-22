const admZip = require('adm-zip');
const fs = require('fs');

const path = `./lambdas-dist/${process.argv[2]}`;
const zip = new admZip();
fs.readdirSync(`./lambdas-dist/${process.argv[2]}`).map(file => zip.addLocalFile(`${path}/${file}`));
zip.writeZip(`${path}/${process.argv[2]}.zip`);

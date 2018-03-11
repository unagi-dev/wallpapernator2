const fs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, '../views/templates');

let templateList = [];
let templateData = '';

fs.readdirSync(templatePath)
    .forEach((file) => {
        if (file.endsWith('.html')) {
            templateList.push(fs.readFileSync(path.join(templatePath, file), 'utf8'));
        }
    });

templateData = templateList.join('\n');

// fs.readdir(templatePath, (err, files) => {
//     files.forEach((file) => {
//         if (file.endsWith('.html')) {
//             fs.readFile(path.join(templatePath, file), 'utf8', (err, data) => {
//                 templateList.push(data);
//             });
//         }
//     });
// });

// function Get() {
//     return templateList.join('\n');
// }

module.exports = templateData;

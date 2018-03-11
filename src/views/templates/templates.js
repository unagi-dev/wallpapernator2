// Load Knockout templates into DOM
let templateData = ipcRenderer.sendSync('getTemplates');
document.write(templateData);
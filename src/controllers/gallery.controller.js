const shell = require('electron').shell;

function openImage(args) {
    if (args[1]) {
        shell.showItemInFolder(args[0]);
    }
    else {
        shell.openItem(args[0]);
    }
}

module.exports = {
    OpenImage: openImage
};
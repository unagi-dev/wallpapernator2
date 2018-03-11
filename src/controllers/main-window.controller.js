import { BrowserWindow } from 'electron';
const remote = require('electron').remote;
const path = require('path');
const ctrls = require('./');

let window;
const iconPath = path.join(__dirname, '../img/icon.ico');

function init() {
    if (window) {
        window.show();
        return;
    }

    window = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        title: 'Wallpapernator2',
        icon: iconPath,
        frame: false,
        webPreferences: {
            webSecurity: false
        }
    });

    loadFuncs();

    window.loadURL(`file://${__dirname}/../views/main-window.html`);

    window.on('close', (event) => {
        window = null;
    });
}

function loadFuncs() {
    window.openDevTools = openDevTools;
    window.spotlight = {
        detectResolutions: ctrls.Spotlight.DetectResolutions
    }
}

function openDevTools() {
    if (window) window.webContents.openDevTools();
}

module.exports = {
    Init: init,
    OpenDevTools: openDevTools
};
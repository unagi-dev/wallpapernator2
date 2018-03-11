import { Menu, Tray } from 'electron';
const path = require('path');
const iconPath = path.join(__dirname, '../img/icon.ico');

let tray, openClick;

function init() {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', click: showMainWindow },
        { label: 'Quit', click: app.quit }
    ]);

    tray.setToolTip('Wallpapernator2');
    tray.setContextMenu(contextMenu);
    tray.on('click', showMainWindow);
}

function showMainWindow() {
    if (!openClick) { return; }

    openClick();
}

function setOpenClick(openClickAction) {
    openClick = openClickAction;
}

function quit() {
    app.quit();
}

init();

module.exports = {
    SetOpenClick: setOpenClick
};
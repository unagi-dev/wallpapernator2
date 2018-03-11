import { BrowserWindow } from 'electron';
import { setTimeout } from 'timers';
const electron = require('electron');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const sharp = require('sharp');
//const thumbPath = path.join(__dirname, '../views/thumbnails');
const thumbPath = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, 'wallpapernator2', 'thumbs');
const THUMB_WIDTH = 142;
const THUMB_HEIGHT = 80;

let wpPath;
let thumbList = [];
let infoTimer;
let screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
let notify = false;
let winCount = 0;

let sync = function (wallpaperPath, newImgNotify) {
    wpPath = wallpaperPath;
    notify = newImgNotify;

    if (!fs.existsSync(thumbPath)) {
        fs.mkdirSync(thumbPath);
    }

    syncDownstream();
    initThumbList();
};

function syncDownstream() {
    fs.readdir(wpPath, (err, files) => {
        if (err) { return; }

        files.forEach((file) => {
            let fullpath = path.join(wpPath, file);
            let destPath = path.join(thumbPath, file);

            fs.exists(destPath, (exists) => {
                if (!exists) {
                    createThumb(fullpath, destPath, file);
                }
            });
        });
    });
}

function createThumb(inPath, outPath, filename) {
    sharp(inPath)
        .resize(THUMB_WIDTH, THUMB_HEIGHT)
        .toFile(outPath, (err, info) => {
            getThumbFileInfo(filename, notify);
        });
}

function initThumbList() {
    let files = fs.readdirSync(thumbPath);
    files.forEach((file) => {
        getThumbFileInfo(file);
    });
}

function getThumbFileInfo(filename, doNotify) {
    if (!filename) { return; }

    try {
        let origpath = path.join(wpPath, filename);
        let fullpath = path.join(thumbPath, filename);
        let existsInList = thumbList.find(x => x.filepath == fullpath);

        if (existsInList) { return; }

        let fi = { filename: filename };

        fs.stat(fullpath, (err, thumbStats) => {
            if (!thumbStats || !thumbStats.isFile()) { return; }

            fs.stat(origpath, (err, origStats) => {
                if (!origStats || !origStats.isFile()) { return; }

                fi.filepath = origpath;
                fi.created = moment(origStats.ctime).format('YYYY-MM-DD HH:mm:ss');
                fi.size = Math.round(origStats.size / 1024);

                let bitmap = fs.readFileSync(fullpath);
                let imgBase64 = new Buffer(bitmap).toString('base64');
                fi.dataUrl = `data:image/gif;base64,${imgBase64}`;

                thumbList.push(fi);
                if (doNotify) { newImageNotify(fi.dataUrl); }
            });
        });
    }
    catch (err) { } // Nobody cares.. about anything.. in life
}

let getThumbList = function () {
    return thumbList.sort(dateCompare);
}

function dateCompare(a, b) {
    if (a.created < b.created)
        return 1;
    if (a.created > b.created)
        return -1;
    return 0;
}

let createNewThumb = function (filename) {
    let destPath = path.join(thumbPath, filename);
    fs.exists(destPath, (exists) => {
        if (!exists) {
            let fullpath = path.join(wpPath, filename)
            createThumb(fullpath, destPath, filename);
        }
    });
}

function newImageNotify(img) {
    winCount++;

    let win = new BrowserWindow({
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        minWidth: THUMB_WIDTH,
        minHeight: THUMB_HEIGHT,
        title: '',
        frame: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        x: screenSize.width - THUMB_WIDTH,
        y: screenSize.height - (THUMB_HEIGHT * winCount),
        transparent: true,
        webPreferences: {
            webSecurity: false
        }
    });

    win.dataUrl = img;
    win.loadURL(`file://${__dirname}/../views/thumb-notify.html`);

    win.on('closed', () => {
        winCount--;
        win = null;
    });
}

module.exports = {
    Sync: sync,
    CreateNewThumb: createNewThumb,
    GetThumbList: getThumbList
};

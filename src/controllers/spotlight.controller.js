const fs = require('fs');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const moment = require('moment');
const logger = require('./logger.controller');
const thumbs = require('./thumbnails.controller');
const spotlightDir = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, 'Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets');
const INTERVAL = 15 * 60 * 1000; // Every 15min

let spotlightPath;
let destinationPath;
let resList;
let timer;
let imgWidth;
let imgHeight;

function start(dir, destination, width, height) {
    stop();

    // Check if directories exists
    try {
        global.status.SpotlightMessage = 'Invalid Spotlight folder.';
        let stats = fs.statSync(dir);
        if (!stats.isDirectory()) { return; }

        global.status.SpotlightMessage = 'Invalid wallpaper destination folder.';
        stats = fs.statSync(destination);
        if (!stats.isDirectory()) { return; }
    }
    catch (err) { return; }

    global.status.SpotlightMessage = 'Running';
    spotlightPath = dir;
    destinationPath = destination;
    imgWidth = width;
    imgHeight = height;

    timer = setInterval(processSpotlight, INTERVAL);
}

function stop() {
    if (timer) {
        clearInterval(timer);
    }
    timer = null;
}

function detectSpotlightPath() {
    try {
        let stats = fs.statSync(spotlightDir);
        if (!stats.isDirectory()) {
            logger.Log('Failed to detect Spotlight directory.');
            return '';
        }

        logger.Log('Detected Spotlight directory: ' + spotlightDir);
        return spotlightDir;
    }
    catch (err) {
        logger.Log('Failed to detect Spotlight directory.');
        return '';
    }
}

function detectResolutions(spPath) {
    let dir = spotlightPath || spPath;
    resList = [];

    if (!fs.existsSync(dir)) { return resList; }

    fs.readdirSync(dir)
        .forEach((file) => {
            let image = nativeImage.createFromPath(path.join(dir, file));
            let size = image.getSize();
            if (!resList.some(x => x.width == size.width && x.height == size.height)) { resList.push(size); }
        });

    return resList.reverse();
}

// Check for new spotlight images and copy them if they don't exist
function processSpotlight() {
    // Check if directories exists.. again
    try {
        global.status.SpotlightMessage = 'Invalid Spotlight folder.';
        let stats = fs.statSync(spotlightPath);
        if (!stats.isDirectory()) { return; }

        global.status.SpotlightMessage = 'Invalid wallpaper destination folder.';
        stats = fs.statSync(destinationPath);
        if (!stats.isDirectory()) { return; }
    }
    catch (err) { return; }

    global.status.SpotlightMessage = 'Running';

    // Check Spotlight files
    fs.readdir(spotlightPath, (err, files) => {
        if (err) { return; }

        files.forEach((file) => {
            let fullpath = path.join(spotlightPath, file)
            let destPath = path.join(destinationPath, `${file}.jpg`);

            if (fs.existsSync(destPath)) { return; }

            let image = nativeImage.createFromPath(fullpath);
            let size = image.getSize();
            if (size.width !== imgWidth || size.height !== imgHeight) { return; }

            fs.createReadStream(fullpath)
                .pipe(fs.createWriteStream(destPath))
                .on('finish', () => { newImageAdded(`${file}.jpg`); });
        });
    });
}

function newImageAdded(newfile) {
    global.status.SpotlightLastImage = moment().format('YYYY-MM-DD HH:mm:ss');
    logger.Log('New Spotlight image: ' + newfile);
    setTimeout(() => { thumbs.CreateNewThumb(newfile); }, 1000);
}

module.exports = {
    DetectResolutions: detectResolutions,
    DetectSpotlightPath: detectSpotlightPath,
    Start: start,
    Stop: stop,
    Timer: timer,
    ProcessSpotlight: processSpotlight
};


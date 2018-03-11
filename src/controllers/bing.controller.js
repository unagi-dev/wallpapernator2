const fs = require('fs');
const path = require('path');
const moment = require('moment');
const logger = require('./logger.controller');
const thumbs = require('./thumbnails.controller');
const request = require('request');
const bingUrl = 'https://www.bing.com';

let destinationPath;
let bingTimer;

function start(interval, destination) {
    stop();

    if (!interval) {
        global.status.BingMessage = 'Disabled (Never check).';
        return;
    }

    // Check if directories exists
    try {
        global.status.BingMessage = 'Invalid wallpaper destination folder.';
        let stats = fs.statSync(destination);
        if (!stats.isDirectory()) { return; }
    }
    catch (err) { return; }

    global.status.BingMessage = 'Running';
    destinationPath = destination;

    bingTimer = setInterval(processBing, (interval * 60 * 1000));
}

function stop() {
    if (bingTimer) {
        clearInterval(bingTimer);
    }
    bingTimer = null;
}

// Check for new Bing image
function processBing() {
    // Check if directories exists.. again
    try {
        global.status.BingMessage = 'Invalid wallpaper destination folder.';
        let stats = fs.statSync(destinationPath);
        if (!stats.isDirectory()) { return; }
    }
    catch (err) { return; }

    global.status.BingMessage = 'Running';

    try {
        request(bingUrl, (error, response, body) => {
            if (error) {
                global.status.BingMessage = `Error accessing ${bingUrl} : ${error})`;
                logger.Log(global.status.BingMessage);
                return;
            }

            if (!response || response.statusCode !== 200) {
                global.status.BingMessage = `Error accessing ${bingUrl} : ${response ? response.statusCode : 'unknown'})`;
                logger.Log(global.status.BingMessage);
                return;
            }

            // Get image url from body html
            let imgUrl = getImageUrl(body);
            if (!imgUrl) {
                global.status.BingMessage = 'Unable to find image from Bing.';
                logger.Log('Unable to find image from Bing.');
                return;
            }

            // Check if file exists and save
            let file = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
            let destPath = path.join(destinationPath, file);
            if (fs.existsSync(destPath)) { return; }

            request(imgUrl)
                .pipe(fs.createWriteStream(destPath))
                .on('finish', () => { newImageAdded(file); });
        });
    }
    catch (err) {
        logger.Log(`Error accessing processing bing: ${err && err.message ? err.message : 'Unknown error.'})`);
    }
}

function getImageUrl(html) {
    var rx = /(\/([\w\d]+))+\.jpg/gi;
    var found = html.match(rx);
    if (found && found.length) {
        return bingUrl + found[0];
    }
    return null;
}

function newImageAdded(newfile) {
    global.status.BingLastImage = moment().format('YYYY-MM-DD HH:mm:ss');
    logger.Log('New Bing image: ' + newfile);
    setTimeout(() => { thumbs.CreateNewThumb(newfile); }, 1000);
}

module.exports = {
    Start: start,
    Stop: stop,
    ProcessBing: processBing
};


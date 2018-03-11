const CronJob = require('cron').CronJob;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const thumbs = require('./thumbnails.controller');
const wallpaper = require('wallpaper');
let NEWER = 20;
let destinationPath, job, idx;

function start(interval, destination) {
    stop();
    idx = 0;
    destinationPath = destination;

    job = new CronJob({
        cronTime: `00 */${interval} * * * *`,
        onTick: setWallpaper,
        start: true
    });
}

function stop() {
    if (job && job.running) {
        job.stop();
    }
    job = null;
}

function setWallpaper() {
    let thmList = thumbs.GetThumbList();
    let len = thmList.length;
    let newer = Math.random() > 0.3;

    if (len < NEWER) {
        idx = Math.floor((Math.random() * len));
    }
    else if (newer) {
        idx = Math.floor((Math.random() * NEWER));
    }
    else {
        idx = Math.floor((Math.random() * (len - NEWER)) + NEWER);
    }

    let wp = path.join(destinationPath, thmList[idx].filename)
    wallpaper.set(wp).then(() => { });
}

module.exports = {
    Start: start,
    Stop: stop
};


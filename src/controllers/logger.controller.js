const moment = require('moment');
const path = require('path');
const fs = require('fs');
const eol = require('os').EOL;
const MAXLOGS = 30;
const logPath = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, 'wallpapernator2', 'log.txt');

let logs = [];
let hasInitialized = false;

function log(txt) {
    let str = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${txt}`;
    let len = logs.unshift(str);
    if (len > MAXLOGS) { logs.pop(); } // 1337 rolling strat yo
    writeLog();
}

function writeLog() {
    fs.writeFile(logPath, getLogs(), () => { });
}

function getLogs() {
    return logs.join(eol);
}

function getLogsHtml() {
    return logs.join('<br>');
}

function init() {
    if (hasInitialized) { return; }
    hasInitialized = true;

    // Get current logs
    try {
        let stats = fs.statSync(logPath);
        if (!stats.isFile()) { return; }

        try {
            let logData = fs.readFileSync(logPath, 'utf8');
            logs = logData.split(eol);
        }
        catch (err) { } // who nose
    }
    catch (err) { } // ain't nobody got time
}

init();

module.exports = {
    Log: log,
    GetLogs: getLogs,
    GetLogsHtml: getLogsHtml
};
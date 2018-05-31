const path = require('path');
let settings = new Settings(); // In main.js
let tmpVar = {};

let bingIntervals = [
    { value: 0, name: 'Never' },
    { value: 1, name: 'Every hour' },
    { value: 3, name: 'Every 3 hours' },
    { value: 6, name: 'Every 6 hours' },
    { value: 12, name: 'Every 12 hours' }
];

// Document ready
$(() => {
    loadSettings();
    hookEvents();
});

// Load settings
function loadSettings() {
    settings.Load(() => {
        settings.SpotlightResList = mainWindow.spotlight.detectResolutions(settings.SpotlightPath());
        //console.log(mainWindow.spotlight.detectResolutions(settings.SpotlightPath()));
        let res = settings.SpotlightResList.find(x => x.width == settings.SpotlightImageWidth() && x.height == settings.SpotlightImageHeight());
        if (!res) {
            res = { width: settings.SpotlightImageWidth(), height: settings.SpotlightImageHeight() };
            settings.SpotlightResList.push(res);
        }
        settings.selectedSpotlightRes(res);
        settings.bingIntervalName(bingIntervals.find(x => x.value == settings.BingInterval()).name);
        settings.bingIntervals = bingIntervals;

        tmpVar.WallpaperPath = settings.WallpaperPath();
        tmpVar.SpotlightPath = settings.SpotlightPath();

        ko.applyBindings(settings);
    });
}

// Hook change events for saving settings
function hookEvents() {
    // Checkboxes
    $('#RunAtStartup, #NewWallpaperNotification').change(function () {
        settings.Save();
    });
}

// Spotlight res change
function spotlightResList_click(size) {
    settings.SpotlightImageWidth(size.width);
    settings.SpotlightImageHeight(size.height);
    settings.Save();
}

// Bing interval change
function bingIntervals_click(interval) {
    settings.bingIntervalName(interval.name);
    settings.BingInterval(interval.value);
    settings.Save();
}

function btnBrowseWallpaper_click() {
    browseFolder('WallpaperPath');
}

function btnBrowseSpotlight_click() {
    browseFolder('SpotlightPath');
}

function browseFolder(prop) {
    dialog.showOpenDialog(null, {
        properties: ['openDirectory']
    }, (paths) => {
        if (!paths || !paths.length) { return; }
        validateDir(prop, paths[0]);
    });
}

function validateDir(dirProp, dir) {
    if (!dir) {
        settings[dirProp](tmpVar[dirProp]);
        return;
    }

    dir = path.join(dir);
    fs.stat(dir, function (err, stats) {
        console.log(err);
        if (err || !stats.isDirectory()) {
            settings[dirProp](tmpVar[dirProp]);
            return;
        }

        // Valid - update and save
        tmpVar[dirProp] = dir;
        settings[dirProp](dir);
        settings.Save();
    });
}

function folderUpdated_blur(dirProp) {
    validateDir(dirProp, settings[dirProp]());
}
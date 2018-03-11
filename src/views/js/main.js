const fs = require('fs');
const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

// Settings
function Settings() {
    this.WallpaperPath = ko.observable('');
    this.SpotlightPath = ko.observable('');
    this.SpotlightImageWidth = ko.observable('');
    this.SpotlightImageHeight = ko.observable('');
    this.selectedSpotlightRes = ko.observable({ width: 1920, height: 1080 });
    this.BingInterval = ko.observable(0);
    this.bingIntervalName = ko.observable('Never');
    this.RunAtStartup = ko.observable(false);
    this.NewWallpaperNotification = ko.observable(true);
    this.logs = ko.observable('');
    this.status = ko.observable({});
}

// Load settings
Settings.prototype.Load = function (cb) {
    ipcRenderer.on('getSettingsCallback', (event, data) => {
        for (var prop in data) {
            if (data.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                if (typeof (this[prop]) === 'function') {
                    this[prop](data[prop]);
                };
            }
        }
        if (cb) { cb(); }
    });

    ipcRenderer.send('getSettingsAsync');
};

// Save settings
Settings.prototype.Save = function (cb) {
    ipcRenderer.on('saveSettingsCallback', (event, data) => {
        if (cb) { cb(); }
    });

    ipcRenderer.send('saveSettingsAsync', ko.toJS(this));
};

function body_resize() {
    let h = window.innerHeight;
    $('body').height(h);
    $('#sidebar').height(h - 20);
    $('#imgContainer').height(h - 73);
}
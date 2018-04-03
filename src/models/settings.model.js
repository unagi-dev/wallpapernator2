const fs = require('fs');
const path = require('path');
const settingsPath = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, 'wallpapernator2', 'settings.json');

class Settings {
    WallpaperPath;
    SpotlightPath;
    SpotlightImageWidth;
    SpotlightImageHeight;
    BingInterval;
    RunAtStartup;

    constructor() {
        // Defaults
        this.WallpaperPath = '';
        this.SpotlightPath = '';
        this.SpotlightImageWidth = 1920;
        this.SpotlightImageHeight = 1080;
        this.BingInterval = 0;
        this.RunAtStartup = false;
        this.NewWallpaperNotification = true;

        if (!fs.existsSync(settingsPath)) {
            let appdata = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, 'wallpapernator2');
            if (!fs.existsSync(appdata)) { fs.mkdirSync(appdata); }
            return;
        }

        let json = fs.readFileSync(settingsPath);
        let fromFile = JSON.parse(json);
        this.Map(fromFile);
    }

    Save(fromObj) {
        if (fromObj) {
            for (var prop in fromObj) {
                if (fromObj.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                    this[prop] = fromObj[prop];
                }
            }
        }

        let json = JSON.stringify(this, null, 4);
        fs.writeFileSync(settingsPath, json);
    }

    Map(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                this[prop] = obj[prop];
            }
        }
    }
}

module.exports = Settings;
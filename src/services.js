import { Bing, Gallery, MainWindow, Spotlight, Templates, Thumnails, Tray, Wallpaper } from './controllers';
import { ipcMain } from 'electron';

const logger = require('./controllers/logger.controller');
const Settings = require('./models/settings.model');
const Status = require('./models/status.model');

let settings = new Settings();
let hasInitialized = false; // being paranoid
//C:\Users\david\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
// IPC function calls
function initIpc() {
    // Examples
    //ipcMain.on('ipc-sync', (event, arg) => { event.returnValue = data; });
    //ipcMain.on('ipc-async', (event, arg) => { event.sender.send('callbackFunction', data); });

    // Get knockout templates
    ipcMain.on('getTemplates', (event) => { event.returnValue = Templates; });

    // Settings
    ipcMain.on('getSettingsAsync', (event) => { event.sender.send('getSettingsCallback', settings); });
    ipcMain.on('saveSettingsAsync', (event, arg) => { event.sender.send('saveSettingsCallback', settings.Save(arg)); startProcesses(); logger.Log('Settings updated.'); });

    // Gallery
    ipcMain.on('getThumbnailsAsync', (event) => { event.sender.send('getThumbnailsCallback', Thumnails.GetThumbList()); });
    ipcMain.on('openImageAsync', (event, arg) => { Gallery.OpenImage(arg); });

    // Dashboard
    ipcMain.on('getLogsAsync', (event) => { event.sender.send('getLogsCallback', logger.GetLogsHtml()); });
    ipcMain.on('getStatusAsync', (event) => { event.sender.send('getStatusCallback', global.status); });
    ipcMain.on('processSpotligthAsync', (event) => { event.sender.send('processSpotligthCallback', Spotlight.ProcessSpotlight()); });
    ipcMain.on('processBingAsync', (event) => { event.sender.send('processBingCallback', Bing.ProcessBing()); });
}


// Initialize main service
if (!hasInitialized) {
    hasInitialized = true;

    global.status = new Status();
    initIpc();
    Tray.SetOpenClick(MainWindow.Init);

    settings.SpotlightPath = settings.SpotlightPath || Spotlight.DetectSpotlightPath();
    settings.Save();

    startProcesses();
}

function startProcesses() {
    Spotlight.Start(settings.SpotlightPath, settings.WallpaperPath, settings.SpotlightImageWidth, settings.SpotlightImageHeight);
    Bing.Start(settings.BingInterval, settings.WallpaperPath);
    Thumnails.Sync(settings.WallpaperPath, settings.NewWallpaperNotification);
    //Wallpaper.Start(1, settings.WallpaperPath);
}

module.exports = {
}


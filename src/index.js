import { app, BrowserWindow, Menu, Tray, Notification } from 'electron';
const logger = require('./controllers/logger.controller');
const path = require('path');
let services;

global.app = app;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Electron loaded - start app
app.on('ready', () => {
  services = require('./services');
  logger.Log('App started.');
});

// Don't quit - we're running a tray app here..
app.on('window-all-closed', (event) => {
  event.preventDefault();
  return false;
});

// Show on activate
app.on('activate', () => {
});

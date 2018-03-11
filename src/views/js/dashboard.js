
$(() => {
    ipcRenderer.on('getLogsCallback', getLogsCallback);
    ipcRenderer.on('getStatusCallback', getStatusCallback);
    ipcRenderer.on('processSpotligthCallback', processSpotligthCallback);
    ipcRenderer.on('processBingCallback', processBingCallback);

    window.setInterval(dashboardUpdates, 5000);
    dashboardUpdates();
});

function dashboardUpdates() {
    getLogs();
    getStatus();
}

function getLogs() {
    ipcRenderer.send('getLogsAsync');
}

// Log updates
function getLogsCallback(event, data) {
    settings.logs(data);
}

function getStatus() {
    ipcRenderer.send('getStatusAsync');
}

// Status changes
function getStatusCallback(event, data) {
    settings.status(data);
}

// Check for Spotlight images
function processSpotligth_click() {
    ipcRenderer.send('processSpotligthAsync');
}

function processSpotligthCallback() {
    dashboardUpdates();
}

// Check for Bing image
function processBing_click() {
    ipcRenderer.send('processBingAsync');
}

function processBingCallback() {
    dashboardUpdates();
}

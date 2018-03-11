const remote = require('electron').remote;
let mainWindow = remote.getCurrentWindow();

// Document ready
$(() => {
    body_resize(); // set heights on initial load
    $('#tplSettings').fadeIn();
    window.setTimeout(() => { $('[data-toggle="tooltip"]').tooltip(); }, 500); // Wait for templates to load

    mainWindow.openDevTools();
});


// Title bar buttons
function titlebarX_click() {
    mainWindow.close();
}

function titlebarMax_click() {
    if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
    } else {
        mainWindow.unmaximize();
    }
}
function titlebarMin_click() {
    mainWindow.minimize();
}

// Menu

function btnSettings_click() {
    $('.page-template').hide();
    $('#tplSettings').fadeIn();
}

function btnGallery_click() {
    $('.page-template').hide();
    $('#tplGallery').fadeIn();
}

function btnDash_click() {
    $('.page-template').hide();
    $('#tplDash').fadeIn();
}
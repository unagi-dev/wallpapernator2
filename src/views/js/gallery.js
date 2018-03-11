
let thumbs = [];

$(() => {
    ipcRenderer.on('getThumbnailsCallback', getThumbnailsCallback);
    getThumbs();
});

function getThumbs() {
    ipcRenderer.send('getThumbnailsAsync');
}

function getThumbnailsCallback(event, data) {
    data.reverse().forEach(img => {
        if (thumbs.find(x => x.filename == img.filename)) { return; }

        thumbs.unshift(img);
        addImage(img);
    });
    resizeContainer();
}

function addImage(img) {
    let escapedPath = img.filepath.replace(/\\/g, '\\\\');
    let imgId = img.filename.replace(/\./g, '');
    let row = `
    <tr>
        <td>
            <a href="#" onclick="openImage('${escapedPath}')"><img id="${imgId}" src="${img.dataUrl}" width="142" height="80"></img></a>
        </td>
        <td>
            <a href="#" onclick="showInFolder('${escapedPath}')">${img.filename}</a><br/>
            ${img.created}<br/>
            ${img.size}kb
        </td>
    </tr>`;

    $(row).insertAfter('#tblImgTop');
}

function refreshGallery_click() {
    getThumbs();
}

function openImage(imgPath) {
    ipcRenderer.send('openImageAsync', [imgPath, false]);
}

function showInFolder(imgPath) {
    ipcRenderer.send('openImageAsync', [imgPath, true]);
}

function resizeContainer() {
    $('#imgContainer').height(window.innerHeight - 73);
}
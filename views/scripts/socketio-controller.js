/* socket receivers */
socket.on('task-failed', (data) => {
    dismissSnackbars('info');
    dismissSnackbars('success');
    SnackBar.create({
        type: 'error',
        message: '&#128711; ' + data + ' &#128711;',
        show: true,
        auto_dismiss: true,
        uuid: create_UUID()
    });
    SnackBar.on('error-snackbar-dismissed', () => {
        $("#upload-yt-link-btn").prop('disabled', false);
    })
})

socket.on('done-importing', (data) => {
    let response = JSON.parse(data);
    let songItem = {
        'index': songs.length,
        'name': response.name.substring(response.name.indexOf('-') + 1),
        'artist': response.artist,
        'location': response.location,
        'uuid': response.uuid
    }
    songs.push(songItem);

    // push new song item to the DOM song list modal
    let artist = (songItem.artist)?songItem.artist:"";
    let name = (songItem.name)?songItem.name:"";
    let uuid = songItem.uuid;

    // initiate player if this is the first song.
    if (songs.length == 1) {
        let myp5 = new p5(soundFunctions);

        let DOMSongItem = $(`<div id='${uuid}' class='song-item'> <div onclick="loadSong('${uuid}', true)">PLAY</div> <span class="song-name">${name}</span> <span class="song-artist">${artist}</span></div>`)
        DOMSongListItems.append(DOMSongItem);
    }
});

let taskUpdateSnackbarUUID;
socket.on('task-update', (data) => {
    // instantiate new snackbar
    if ($(".snackbar-success").length < 1 || data == 'start') {
        taskUpdateSnackbarUUID = create_UUID();

        const options = {
            type: 'success',
            message: '&#128504; ' + data,
            auto_dismiss: (data=='Done'), // auto dismiss when task completes.
            uuid: taskUpdateSnackbarUUID
        }
        dismissSnackbars('info');
        SnackBar.create(options);
    }
    // update existing snackbar
    else {
        $(`.snackbar-${taskUpdateSnackbarUUID}`).html(`&#128504; ${data}`);
        if(data=='Done') {
            // dismiss created snackbar
            setTimeout(() => {
                $(`.snackbar-${taskUpdateSnackbarUUID}`).removeClass('snackbar-show');
                $(`.snackbar-${taskUpdateSnackbarUUID}`).addClass('snackbar-hide');
                
                setTimeout(()=>{
                    $(`.snackbar-${taskUpdateSnackbarUUID}`).remove();
                }, 500)
            }, 3000);
        }
    }
    $("#upload-yt-link-btn").prop('disabled', (data!='Done'));

});
socket.on('dismiss-success-snackbars', () => {
    dismissSnackbars('success');
})
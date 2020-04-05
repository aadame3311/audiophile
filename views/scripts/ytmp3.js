$("#upload-yt-link-btn").on('click', (e) => {
    e.preventDefault();
    let importLink = $("#import-link-input").val();

    // send request
    socket.emit('task[import]-started');
    $.post("/ytmp3", {
        import_link: importLink
    })
    .done((res) => {
        console.log(res);
        let response = JSON.parse(res);
        songs.push({
            'name': response.name,
            'artist': 'Import',
            'location': response.location
        })
        // initiate player if this is the first song.
        if (songs.length == 1) {
            console.log('initiating sound.js');
            let myp5 = new p5(soundFunctions);

        }
        console.log(songs);
    })
    .fail((xhr, status, error) => {
        
    })
});
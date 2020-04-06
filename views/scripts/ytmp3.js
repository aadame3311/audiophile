$("#upload-yt-link-btn").on('click', (e) => {
    e.preventDefault();
    let importLink = $("#import-link-input").val();


    $("#upload-yt-link-btn").prop('disabled', true);

    // send request
    socket.emit('task[import]-started');
    $.post("/ytmp3", {
        import_link: importLink
    })
    .done((res) => {
        let response = JSON.parse(res);
        songs.push({
            'name': response.name.substring(response.name.indexOf('-') + 1),
            'artist': response.name.match(/.+?(?=\-)/),
            'location': response.location
        })
        // initiate player if this is the first song.
        if (songs.length == 1) {
            let myp5 = new p5(soundFunctions);
        }
    })
    .fail((xhr, status, error) => {
        
    })
});
$("#upload-yt-link-btn").on('click', () => {
    console.log('converting youtube to mp3');
    let importLink = $("#import-link-input").val();
    $.post("/ytmp3", {
        import_link: importLink
    }, (res) => {
        let response = JSON.parse(res);
        console.log("done");
        console.log(res);
        songs.push({
            'name': response.name,
            'artist': 'Import',
            'location': response.location
        })

        console.log(songs);
    })
    console.log(importLink);
})
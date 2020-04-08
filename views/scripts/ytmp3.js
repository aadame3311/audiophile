$("#upload-yt-link-btn").on('click', (e) => {
    e.preventDefault();
    $("#upload-yt-link-btn").prop('disabled', true);
    let importLink = $("#import-link-input").val();
    socket.emit('task[import]-started', importLink);
});
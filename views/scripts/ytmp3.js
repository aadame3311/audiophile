$("#upload-yt-link-btn").on('click', (e) => {
    e.preventDefault();
    let importLink = $("#import-link-input").val();
    socket.emit('task[import]-started', importLink);
});
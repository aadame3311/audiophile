/* socket receivers */
socket.on('task-failed', (data) => {
    SnackBar.toggle({
        type: 'error',
        message: '&#128711; ' + data + ' &#128711;',
        show: true,
        new_instance: true,
        auto_dismiss: true
    });
    SnackBar.on('snackbar-dismissed', () => {
        $("#upload-yt-link-btn").prop('disabled', false);
    })
})
socket.on('task-update', (data) => {
    const options = {
        type: 'success',
        message: '&#128504; ' + data,
        new_instance: (data == 'start'),
        auto_dismiss: (data == 'complete'), // auto dismiss when task completes.
    }
    SnackBar.toggle(options);
    $("#upload-yt-link-btn").prop('disabled', (data!='complete'));
});
socket.on('dismiss-success-snackbars', () => {
    dismissSuccessSnackbars();
})
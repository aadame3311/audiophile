/* socket receivers */
socket.on('task-failed', (data) => {
    toggleSnackbar({
        type: 'error',
        message: data,
        show: true,
    }, () => {
        $("#upload-yt-link-btn").prop('disabled', false);
        snackbarTimeout = setTimeout(() => {
            toggleSnackbar({
                show: false
            })
        }, 3000)
    });
})
socket.on('task-update', (data) => {
    toggleSnackbar({
        type: 'success',
        message: data,
        show: true,
    }, () => {
        if (data == 'complete') {
            snackbarTimeout = setTimeout(() => {
                toggleSnackbar({
                    show: false
                })
            }, 1000)
        }
    });
    $("#upload-yt-link-btn").prop('disabled', (data!='complete'));
})
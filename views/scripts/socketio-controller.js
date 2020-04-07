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
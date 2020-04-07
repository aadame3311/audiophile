
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const youtubedl = require('youtube-dl');
const fileUpload = require('express-fileupload');
const handlebars = require('express-handlebars');
const path = require('path'); // Path module.
const bodyParser = require('body-parser');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'songs')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'tmp/'
}));
app.use(bodyParser.urlencoded({ extended: false }));
ffmpeg.setFfmpegPath("./resources/ffmpeg/bin/ffmpeg.exe");

/* view routes */
app.get('/', (req, res) => {

    fs.readFile('./resources/themes.json', (err, json) => {
        let themes = JSON.parse(json);
        res.render('index', {"themes": themes});
    })
});

/* api routes */
app.post('/ytmp3', (req, res, next) => {
    console.log(req.body);
    let importLink = req.body.import_link;
    let fileName = "";
    try {
        // validate youtube link with regex...
        let youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=/;
        const isMatch = importLink.match(youtubeRegex);

        if (isMatch) {
            // download youtube video...
            io.emit('task-update', 'start');
            io.emit('task-update', 'Starting Import');
            const video = youtubedl(importLink,
                ['--format=18'],
                {cwd: __dirname}
            );
            video.on('info', function(info) {
                console.log('[Download Started]')

                if (info.size > 30000000) {
                    io.emit('dismiss-success-snackbars');
                    io.emit('task-failed', "File size is over 30MB");
                    
                    return;//res.status(500).send('error');
                }

                io.emit('task-update', 'Importing');
                let fileNameRaw = info._filename;
                fileName = fileNameRaw.substring(0, fileNameRaw.length - 16);
            });
            video.on('end', () => {
                io.emit('task-update', 'Processing');
                console.log('finished downloading');
                // convert mp4 file to mp3.
                ffmpeg('tmp/videotest.mp4')
                    .toFormat('mp3')
                    .on('end', () => {
                        io.emit('task-update', 'Done');
                        console.log("finished converting");
                        // send response with the route to the song
                        let resposneObj = {
                            'name': fileName,
                            'location': `songs/imports/${fileName}.mp3`
                        }
                        res.end(JSON.stringify(resposneObj));
                    })
                    .on('error', (err) => {
                        io.emit('task-failed', 'Error converting to MP3');
                        console.log('An error occurred' + err.message);
                    })
                    .pipe(fs.createWriteStream(`views/songs/imports/${fileName}.mp3`));
            })
            video.on('error', function error(err) {
                io.emit('dismiss-success-snackbars');
                io.emit('task-failed', 'Video ID not found');
                res.status(500).send(err);
            })
            video.pipe(fs.createWriteStream('tmp/videotest.mp4'));
        } else {
            io.emit('task-failed', 'invalid youtube link format');
            throw new Error('Error importing link');
        }
    } 
    catch (err) {
        res.status(500).send(err);
    }
});

/* sockets */
io.on('connection', (socket) => {
    console.log('[a user connected]');

    socket.on('task[import]-started', () => {
        console.log('detected task start');
    });

});

http.listen(port, () => console.log(`Example app running on ${port}`));

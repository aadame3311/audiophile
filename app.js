
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const fs = require('fs');
const fluentFFMPEG = require('fluent-ffmpeg');
const youtubedl = require('ytdl-core');
const handlebars = require('express-handlebars');
const path = require('path'); // Path module.
const bodyParser = require('body-parser');
// required to be this way after uuid@7.x
const {v4:uuidv4} = require('uuid'); 
const cookieParser = require('cookie-parser');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let clients = {};
let songs = [];

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'songs')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'partials')));
app.use('/partials', express.static('views/partials'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
fluentFFMPEG.setFfmpegPath(ffmpegPath);

//let sessionIDs = {};

/* view routes */
app.get('/', (req, res) => {
    fs.readFile('./resources/themes.json', (err, json) => {
        let themes = JSON.parse(json);
        res.render('index', {"themes": themes});
    })
});

/* api routes */
const handleImport = (socket, importLink) => {    
    if (!fs.existsSync('./tmp')){
        fs.mkdirSync('./tmp');
    }
    if (!fs.existsSync(`./views/songs/imports/${socket.id}`)) {
        fs.mkdirSync(`./views/songs/imports/${socket.id}`);
    }

    let songName = "";
    let artistName = "";
    try {
        // validate youtube link with regex...
        let youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=/;
        const isValidFormat = importLink.match(youtubeRegex);
        let uuid = uuidv4();

        if (isValidFormat) {
            // download youtube video...
            socket.emit('task-update', 'start');
            socket.emit('task-update', 'Starting Import');

            const video = youtubedl(importLink, { filter: format => format.container === 'mp4' });
            console.log('test');
            video.on('info', function(info) {
                // emit error if file is too large.
                let formats =  info.player_response.streamingData.formats
                let videoDurationMs = formats[0].approxDurationMs;
                let logString = "import started\n";
                logString += `song name: ${info.player_response.videoDetails.title}\n`;
                logString += `video duration: ${videoDurationMs}`

                // resitrict videos longer than 10min.
                if (videoDurationMs > 600000) {
                    socket.emit('dismiss-success-snackbars');
                    socket.emit('task-failed', "Only videos no longer than 10 min :(");
                    
                    return;
                }
                socket.emit('task-update', 'Importing');

                songName = info.player_response.videoDetails.title;
                artistName = info.author.name;

                console.log(logString);
            });
            video.on('end', () => {
                socket.emit('task-update', 'Processing (this might take a while)');
                console.log('finished downloading');
                // convert mp4 file to mp3.
                ffmpeg('tmp/videotest.mp4')
                    .toFormat('mp3')
                    .on('end', () => {
                        socket.emit('task-update', 'Done');
                        // send response with the route to the song
                        let resposneObj = {
                            'name': songName,
                            'artist': artistName,
                            'uuid': uuid,
                            'socketid': socket.id,
                            'location': `songs/imports/${socket.id}/${uuid}.mp3`
                        }
                        socket.emit('done-importing', JSON.stringify(resposneObj));
                        return;
                    })
                    .on('error', (err) => {
                        socket.emit('task-failed', 'Error importing');
                        console.log('An error occurred' + err.message);
                    })
                    .pipe(fs.createWriteStream(`views/songs/imports/${socket.id}/${uuid}.mp3`));
            })
            video.on('error', function error(err) {
                socket.emit('dismiss-success-snackbars');
                socket.emit('task-failed', 'Video ID not found');
            })
            video.pipe(fs.createWriteStream('tmp/videotest.mp4'));
        } else {
            socket.emit('task-failed', 'invalid youtube link format');
            throw new Error('Error importing link');
        }
    } 
    catch (err) {
        console.log(`caught exception: ${err}`);
    }
}

/* sockets */
io.on('connection', (socket) => {
    console.log(`new user: ${socket.id}`);

    clients[socket.id] = {
        address: socket.handshake.address,
        connection_time: Date.now(),
    }
    socket.on('disconnect', () => {
        delete clients[socket.id];
    });
    socket.on('task[import]-started', (importLink) => {
        handleImport(socket, importLink);
    });
    socket.on("RemoveSong", (song)=>{
        var containingFolder = song.socketid;
        var filename = song.uuid;
        console.log('removing song');
        try {
            fs.unlink(`views/songs/imports/${containingFolder}/${filename}.mp3`, (err)=>{
                console.log(err);
                fs.rmdir(`views/songs/imports/${containingFolder}`, (err)=>{
                    console.log(err);
                });
            });

        }
        catch(ex) {
            console.log(ex);
        }
    })
});

http.listen(port, () => console.log(`Example app running on ${port}`));

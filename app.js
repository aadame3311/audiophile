
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

// configure ffmpeg
ffmpeg.setFfmpegPath("./resources/ffmpeg/bin/ffmpeg.exe");

// youtube dl
// // const video = youtubedl("https://www.youtube.com/watch?v=XejVB_fba04",
// //     ['--format=18'],
// //     {cwd: __dirname}
// // );
// // video.on('info', function(info) {
// //     console.log('Download Started')
// //     console.log(`filename: ${info._filename}`)
// //     console.log(`size: ${info.size}`)
// // });
// // video.on('end', () => {
// //     console.log('finished downloading');
// //     ffmpeg('tmp/videotest.mp4')
// //         .toFormat('mp3')
// //         .on('end', () => {
// //             console.log("finished converting");
// //         })
// //         .on('error', (err) => {
// //             console.log('An error occurred' + err.message);
// //         })
// //         .pipe(fs.createWriteStream('tmp/output.mp3'));
// // })
// // video.pipe(fs.createWriteStream('tmp/videotest.mp4'));


app.get('/', (req, res) => {

    fs.readFile('./resources/themes.json', (err, json) => {
        let themes = JSON.parse(json);
        res.render('index', {"themes": themes});
    })
});

// api
app.post('/ytmp3', (req, res) => {
    console.log(req.body);
    let importLink = req.body.import_link;
    let fileName = "";

    // validate youtube link with regex...

    // download youtube video...
    const video = youtubedl(importLink,
        ['--format=18'],
        {cwd: __dirname}
    );
    video.on('info', function(info) {
        console.log('Download Started')
        console.log(`filename: ${info._filename}`)
        console.log(`size: ${info.size}`)

        fileName = info._filename;
    });
    video.on('end', () => {
        console.log('finished downloading');
        // convert mp4 file to mp3.
        ffmpeg('tmp/videotest.mp4')
            .toFormat('mp3')
            .on('end', () => {
                console.log("finished converting");
                // send response with the route to the song
                let resposneObj = {
                    'name': fileName,
                    'location': `songs/imports/song.mp3`
                }
                res.end(JSON.stringify(resposneObj));
            })
            .on('error', (err) => {
                console.log('An error occurred' + err.message);
            })
            .pipe(fs.createWriteStream(`views/songs/imports/song.mp3`));
    })
    video.pipe(fs.createWriteStream('tmp/videotest.mp4'));



})

app.listen(port, () => console.log(`Example app running on ${port}`));

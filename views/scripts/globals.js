let song;
let songs = [];
let socket = io();
let snackbarTimeout;
let soundFunctions;
let loadSong, initSoundFile, setSongDetails, selectSong, removeSong, togglePlay, skipSong;
let currentSongPlaying, currentSongId;

(function onInit() {
    //localStorage.clear();
    $(document).ready(() => {
        $("#player").hide();
        $(".song-list").hide();

        if (localStorage.getItem("userSongs")) {
            songs = JSON.parse(localStorage.getItem("userSongs"));
            let initCount = 0;

            let myp5 = new p5(soundFunctions);

            SnackBar.create({
                type: 'success',
                message: 'Loading Songs',
                auto_dismiss: false
            });
    
            songs.forEach((song)=> {
                
                SongListModal.append(song);
                song.sound = initSoundFile(song.uuid, (res)=>{

                    initCount++;
                    console.log(`initCount`, initCount);
                    if (initCount >= songs.length) {
                        $("#player").show();
                        $(".song-list").show();
                        console.log('all songs loaded');
                        dismissSnackbars('success');
                    }
                });


            });
        }
        else {
            $("#player").show();
            $(".loading-icon").hide();
            $(".song-list").show();
            dismissSnackbars('success');

            console.log('all songs loaded');
        }
    })
})();

const drawProperties = {
    "rect": {
        drawFunction: (height, width, spectrum, waveform, myp5) => {
            for (var i = 0; i < spectrum.length; i++) {
                let x = myp5.map(i, 0, spectrum.length, 0, width * 2);
                let y = -height + myp5.map(spectrum[i], 0, 255, height, 0);

                myp5.rect(x * 8, height, (width / spectrum.length) * 10, y / 1.5)
            }
        },
        stroke: (r, g, b, myp5) => myp5.noStroke(),
        fill: (r, g, b, myp5) => myp5.fill(r, g, b),
        strokeWeight: (myp5) => myp5.strokeWeight(0),
    },
    "point-waveform": {
        drawFunction: (height, width, spectrum, waveform, myp5) => {
            for (var i = 0; i < waveform.length; i++) {
                let x = myp5.map(i, 0, waveform.length, 0, width * 5);
                let y = myp5.map(waveform[i], -1, 1, height, 0);
                myp5.point(x * 2, y);
            }
        },
        stroke: (r, g, b, myp5) => myp5.stroke(r, g, b),
        fill: (r, g, b, myp5) => myp5.fill(r, g, b),
        strokeWeight: (myp5) => myp5.strokeWeight(5),
    },
    "point-spectrum": {
        drawFunction: (height, width, spectrum, waveform, myp5) => {
            for (var i = 0; i < spectrum.length; i++) {
                let x = myp5.map(i, 0, spectrum.length, 0, width * 2);
                let y = -height + myp5.map(spectrum[i], 0, 255, height, 0);
                
                myp5.point(x, myp5.windowHeight + y);
            }
        },
        stroke: (r, g, b, myp5) => myp5.stroke(r, g, b),
        fill: (r, g, b, myp5) => myp5.fill(r, g, b),
        strokeWeight: (myp5) => myp5.strokeWeight(10),
    },
    "line": {
        drawFunction: (height, width, spectrum, waveform, myp5) => {
            for (var i = 0; i < waveform.length; i++) {
                let x = myp5.map(i, 0, waveform.length, 0, width);
                let y = myp5.map(waveform[i], -1, 1, height, 0);
                myp5.vertex(x*2, y);
            }
        },
        stroke: (r, g, b, myp5) => myp5.stroke(r, g, b),
        fill: (r, g, b, myp5) => myp5.noFill(),
        strokeWeight: (myp5) => myp5.strokeWeight(3),
    },
};
let selDrawOption = "rect";

const body = document.getElementById("body");

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");

// song list modal song DOM elements
let DOMSongListItems = $(".song-list");
const songListModal = document.getElementById("songlist-modal")
const songListModalContainer = $("#songlist-container")

// display style dropdown
const dispStyleSelector = document.getElementById("display-style-selector");

// play btn
const playBtn = document.getElementById('play-btn');
const playBtnIcon = document.getElementById('play-icon');

const nextTrackBtn = document.getElementById('next-track');
const prevTrackBtn = document.getElementById('previous-track');
const skipIcons = document.getElementsByClassName('skip-icon');

// volume slider
const volumeSlider = document.getElementById('volumeSlider');
const volumeDisplayValue = document.getElementById('volume-value');

const themeSelectors = document.getElementsByClassName("theme-selector-item");
let isSettingsOpen = false;

// create playlist btn
const uploadYTLink = document.getElementById("upload-yt-link-btn");

// text inputs
const textInput = document.getElementsByClassName("text-input");

// my songs btn
const mySongsBtn = document.getElementById("mysongs-btn");


// get list of theme selector items
let selectedThemeColor = {
    // default is green
    primary: [148, 211, 172],
    secondary: [239, 252, 239],
    background: [239, 252, 239],
}

const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");

const toggleErrorSnackbar = (options, callback = () => {}) => {
    
}

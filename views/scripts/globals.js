let song;
let songs = [];
let socket = io();
let snackbarTimeout;
let soundFunctions;

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
        strokeWeight: (myp5) => myp5.strokeWeight(5),
    },
};
let selDrawOption = "rect";

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");

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

// get list of theme selector items
let selectedThemeColor = {
    // default is green
    primary: [148, 211, 172],
    secondary: [239, 252, 239],
    background: [239, 252, 239],
}

const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");

const toggleSnackbar = (options, callback = () => {}) => {
    clearTimeout(snackbarTimeout);
    let $snackbar = $(".snackbar");
    let classes = Array.from($snackbar.prop('classList'));
    let existingModifiers = classes.filter(className => className.match(/snackbar-.*/));

    //$snackbar.removeClass(existingModifiers.join(' '));
    $snackbar.removeClass("snackbar-show");
    $snackbar.removeClass("snackbar-hide");
    $snackbar.addClass(`snackbar-${(options.type)?options.type : 'none'}`);
    $snackbar.text((options.message)?options.message : '');

    if (options.show) {
        $snackbar.addClass('snackbar-show');
    } else {
        $snackbar.addClass('snackbar-hide');
    }

    // execute optional callback
    callback();


    // let $snackbar = $(".snackbar");
    // let classes = Array.from($snackbar.prop('classList'));
    // let existingModifiers = classes.filter(className => className.match(/snackbar-.*/));
    
    // if ($snackbar.hasClass(".snackbar-show")) {
    //     // hide existing snackbar
    //     clearTimeout(snackbarTimeout);
    //     $snackbar.removeClass(existingModifiers.join(' '));
    //     //$snackbar.removeClass("snackbar-show");
    //     $snackbar.addClass("snackbar-hide");
    // }

    // // update modifiers
    // existingModifiers = classes.filter(className => className.match(/snackbar-.*/));

    // // show new snackbar
    // $snackbar.addClass(`snackbar-${type}`);
    // $snackbar.text(data);
    // $snackbar.removeClass("snackbar-hide");
    // $snackbar.addClass("snackbar-show");
    
    // if (withTimeout) {
    //     // hide snackbar on timeout
    //     snackbarTimeout = setTimeout(() => {
    //         $snackbar.removeClass("snackbar-show");
    //         $snackbar.addClass("snackbar-hide");
    //     }, 3000)
    // }
    
}
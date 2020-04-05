let song, songs;

const drawProperties = {
    "rect": {
        drawFunction: (height, width, spectrum, waveform) => {
            for (var i = 0; i < spectrum.length; i++) {
                let x = map(i, 0, spectrum.length, 0, width * 2);
                let y = -height + map(spectrum[i], 0, 255, height, 0);

                rect(x * 8, height, (width / spectrum.length) * 10, y / 1.5)
            }
        },
        stroke: (r, g, b) => noStroke(),
        fill: (r, g, b) => fill(r, g, b),
        strokeWeight: () => strokeWeight(0),
    },
    "point": {
        drawFunction: (height, width, spectrum, waveform) => {
            for (var i = 0; i < spectrum.length; i++) {
                let x = map(i, 0, spectrum.length, 0, width * 2);
                let y = -height + map(spectrum[i], 0, 255, height, 0);
                
                point(x, windowHeight + y);
            }
        },
        stroke: (r, g, b) => stroke(r, g, b),
        fill: (r, g, b) => fill(r, g, b),
        strokeWeight: () => strokeWeight(10),
    },
    "line": {
        drawFunction: (height, width, spectrum, waveform) => {
            for (var i = 0; i < waveform.length; i++) {
                let x = map(i, 0, waveform.length, 0, width);
                let y = map(waveform[i], -1, 1, height, 0);
                vertex(x*2, y);
            }
        },
        stroke: (r, g, b) => stroke(r, g, b),
        fill: (r, g, b) => noFill(),
        strokeWeight: () => strokeWeight(5),
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
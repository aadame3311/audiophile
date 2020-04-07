
// Main master file for functions and
// variables used throughout this app
let brightnessMultiplier = 1;
let volume = 0.5;

let prevAmpLevel = 0;
let songIndex = 0;

let canSkip = false; // prevents/allows user from skipping
let canPlayorPause = false;


soundFunctions = (myp5) => {
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        if (sound.isLoaded()) {
            togglePlay();
        }
    });
    nextTrackBtn.addEventListener('click', () => {
        if (songs.length > 1) {
            skipSong('forward');
        }
    });
    prevTrackBtn.addEventListener('click', () => {
        if (songs.length > 1) {
            skipSong('backward');
        }
    });

    // Helper functions for events and overwrites on index.js
    const setPauseIcon = () => {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }
    const setPlayIcon = () => {
        playBtnIcon.classList.remove('fa-pause')
        playBtnIcon.classList.add('fa-play')
    }
    const togglePlay = () => {
        if (sound.isPlaying()) {
            sound.pause();
            setPlayIcon();

        } else {
            sound.play();
            setPauseIcon();
        }
    }
    // Helps control when the user can't or can perform player actions (such as skip or play).
    // This sort of 'regulation' helps with issues when a song hasn't loaded yet but user 
    //      wants to skip. This caused a bug where we would have 2 songs playing at once, once the
    //      the previous loadSound() action caught up to the new one.
    const togglePlayerActions = () => {
        canSkip = !canSkip;
        canPlayorPause = !canPlayorPause;
        if (!canSkip && !canPlayorPause) {
            nextTrackBtn.classList.add('disabled-action');
            prevTrackBtn.classList.add('disabled-action');
            playBtn.classList.add('disabled-action');
        } else if (canSkip && canPlayorPause) {
            nextTrackBtn.classList.remove('disabled-action');
            prevTrackBtn.classList.remove('disabled-action');
            playBtn.classList.remove('disabled-action');
        }
    }
    const skipSong = direction => {
        // Update index and get rid of previous song
        //sound.stop();
        if (canSkip) {
            togglePlayerActions();
            sound.disconnect();

            switch (direction) {
                case 'forward':
                    // reset song index when exceeding songs length
                    if (++songIndex >= songs.length) {
                        songIndex = 0;
                    }
                    break;
                case 'backward':
                    // set to last index if at first index
                    if (--songIndex < 0) {
                        songIndex = songs.length - 1;
                    }
                    break;
            }

            loadSong(true);
        }

    }
    const resetBrightness = () => {
        const resetBrightnessInterval = setInterval(() => {
            brightnessMultiplier -= 0.01
            if (brightnessMultiplier <= 1) {
                brightnessMultiplier = 1;
                clearInterval(resetBrightnessInterval);
            }
        }, 100)
    }
    const loadSong = playSong => {
        
        // Set display song name and artist
        const songNameContainer = document.getElementById('song-name');
        const artistNameContainer = document.getElementById('artist-name');
        songNameContainer.textContent = songs[songIndex].name;
        artistNameContainer.textContent = songs[songIndex].artist;

        sound = myp5.loadSound(songs[songIndex].location, () => {
            if (playSong) {
                sound.play();
                setPauseIcon();
            } else {
                sound.pause();
                setPlayIcon();
            }

            // volume needs to be set every time a song is loaded
            sound.setVolume(volumeSlider.value / 100);

            sound.onended(() => {
                // P5 counts "paused" as onended. We don't want to skip song
                // if user simply paused the song
                if (!sound.isPaused()) {
                    skipSong('forward');
                } 
            });

            togglePlayerActions();
        });
        
    }

    // implement from p5
    myp5.preload = () => {
        
        //sound = loadSound(songs[songIndex].location);
        song = songs[songIndex];

        loadSong();
    }

    // implement from p5
    myp5.setup = function() {
        
        let cnv = myp5.createCanvas(myp5.windowWidth, myp5.windowHeight);
        let x = (myp5.windowWidth - myp5.width) / 2;
        let y = (myp5.windowHeight - myp5.height) / 2;

        cnv.position(x, y);
        cnv.style('display', 'block');
        cnv.style('z-index', '-1');

        fft = new p5.FFT();
        amplitude = new p5.Amplitude();
        if (sound.isLoaded()) {
            sound.amp(volumeSlider.value / 100);
        }
    }

    // implement from p5
    myp5.draw = () => {
        myp5.background(myp5.color(selectedThemeColor.background[0],
                selectedThemeColor.background[1],
                selectedThemeColor.background[2]));

        let spectrum = fft.analyze();
        let waveform = fft.waveform();

        myp5.beginShape();
        let r = selectedThemeColor.primary[0] * brightnessMultiplier;
        let g = selectedThemeColor.primary[1] * brightnessMultiplier;
        let b = selectedThemeColor.primary[2] * brightnessMultiplier;

        // set properties according to selected display style
        drawProperties[selDrawOption].stroke(r, g, b, myp5);
        drawProperties[selDrawOption].fill(r, g, b, myp5);
        drawProperties[selDrawOption].strokeWeight(myp5);

        let ampLevel = amplitude.getLevel();
        let ampDelta = ampLevel - prevAmpLevel;
        if (ampDelta > 0.07) {
            brightnessMultiplier = 1.1;
            resetBrightness();
        }
    
        drawProperties[selDrawOption].drawFunction(myp5.height, myp5.width, spectrum, waveform, myp5);

        myp5.endShape();

        prevAmpLevel = ampLevel;
    }

    // implement from p5
    myp5.windowResized = () => {
        myp5.resizeCanvas(myp5.windowWidth, myp5.windowHeight);
    }

    // p5.setup();
    // p5.preload();
}
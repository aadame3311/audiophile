
// Main master file for functions and
// variables used throughout this app
let brightnessMultiplier = 1;
let volume = 0.5;

let prevAmpLevel = 0;
let songIndex = 0;

let canSkip = true; // prevents/allows user from skipping
let canPlayorPause = false;

let songSkipped = false;


soundFunctions = (myp5) => {
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        if (sound.isLoaded()) {
            togglePlay();
        }
    });
    $("songitem-play-icon").click(()=>{
        if (sound.isLoaded()) {
            togglePlay();
        }
    })
    nextTrackBtn.addEventListener('click', () => {
        songSkipped = true;
        if (songs.length > 1) {
            skipSong('forward');
        }
    });
    prevTrackBtn.addEventListener('click', () => {
        songSkipped = true;
        if (songs.length > 1) {
            skipSong('backward');
        }
    });

    // Helper functions for events and overwrites on index.js
    const setPauseIcon = () => {
        // for main player controls
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');

        // for song list items
        $(`#${currentSongId} div i`).removeClass('fa-play');
        $(`#${currentSongId} div i`).addClass('fa-pause');
    }
    const setPlayIcon = () => {
        // for main player controls
        playBtnIcon.classList.remove('fa-pause')
        playBtnIcon.classList.add('fa-play')

        // for song list items
        $(`#${currentSongId} div i`).removeClass('fa-pause');
        $(`#${currentSongId} div i`).addClass('fa-play');
        //document.getElementById(songId).
    }
    const togglePlay = () => {
        if (currentSongPlaying.sound.isPlaying()) {
            currentSongPlaying.sound.pause();
            setPlayIcon();

        } else {
            currentSongPlaying.sound.play();
            setPauseIcon();
        }
    }
    // provides fine tuned control for pausing a song manually.
    const setPause = () => {
        if (currentSongPlaying.sound.isPlaying()) {
            currentSongPlaying.sound.pause();
            setPlayIcon();
        }
    }
    // provides fine tuned control for playing a song manually.
    const setPlay = () => {
        if (!currentSongPlaying.sound.isPlaying()) {
            currentSongPlaying.sound.play();
            setPauseIcon();
        }
    }
    /* Helps control when the user can't or can perform player actions (such as skip or play).
        This sort of 'regulation' helps with issues when a song hasn't loaded yet but user 
        wants to skip. This caused a bug where we would have 2 songs playing at once, once the
        the previous loadSound() action caught up to the new one. */
    const togglePlayerActions = () => {
        canSkip = !canSkip;
        canPlayorPause = !canPlayorPause;
    }
    const skipSong = direction => {
        // Update index and get rid of previous song
        //sound.stop();
        if (canSkip) {
            //togglePlayerActions();
            setPause();
            currentSongPlaying.sound.stop();

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

            loadSong("", "index");
            // loadSong(getSong("", "index").sound.id, "index", true);
        }

        songSkipped = false;
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

<<<<<<< HEAD
    /* meant to be used to store the sound object for a specific song.
         this way the song can be played on demand without needing to be loaded every time. */
    initSoundFile = (songId="") => {
        console.log("initiating sound file");
        var songToLoad = songs.find(song => song.uuid == songId);
        return myp5.loadSound(songToLoad.location, () => loadSong(songId, "list", false));
    }
    // Set display song name and artist
    setSongDetails = (song) => {
        const songNameContainer = document.getElementById('song-name');
        const artistNameContainer = document.getElementById('artist-name');
=======
    //
    loadSong = (songId="", playSong) => {
        console.log('loading song');
        // Set display song name and artist
        const songNameContainer = document.getElementById('song-name');
        const artistNameContainer = document.getElementById('artist-name');
        songNameContainer.textContent = songs[songIndex].name;
        artistNameContainer.textContent = songs[songIndex].artist;

        // load by songId, else by current index
        if (songId != "") {
            var songToLoad = songs.find(song => song.uuid == songId);
            songIndex = songToLoad.index;
        } else {
            var songToLoad = songs[songIndex];
        }
        
        sound = myp5.loadSound(songToLoad.location, () => {
            if (playSong) {
                sound.play();
                setPauseIcon();
            } else {
                sound.pause();
                setPlayIcon();
            }
>>>>>>> a2cfc93cd629812c93d82958de50eb5be706c3d5

        songNameContainer.textContent = song.name;
        artistNameContainer.textContent = song.artist;
    }
    getSong = (songId="", loadMethod) => {
        switch(loadMethod) {
            case "list":
                var songToLoad = songs.find(song => song.uuid == songId);
                songIndex = songToLoad.index;
                break;
            case "index":
                var songToLoad = songs[songIndex];
                break;
            default: 
                var songToLoad = songs[songs.length-1];
        }

        setSongDetails(songToLoad);
        sound = songToLoad.sound;
        return songToLoad;
    }
    // used when loading a song from init (when imported)
    loadSong = (songId="", loadMethod, playSong=true) => {
        // Get song depending on method specified.
        songToLoad = getSong(songId, loadMethod);

        songToLoad.sound.onended(() => {
            // should only trigger this when the song ends (not skipped)
            if (!songSkipped && songToLoad.sound.isPlaying() && loadMethod != "list") {
                skipSong('foward');
            }
        });

        // only run onupdate
        if (currentSongPlaying != null && currentSongPlaying.sound.isPlaying()) {
            setPause();
            console.log('pausing current song');
            currentSongPlaying.sound.onended(() => {console.log('song ended without event')});
            currentSongPlaying.sound.stop();
        } 
        currentSongPlaying = songToLoad;
        currentSongId = songToLoad.uuid;

        // set volume
        currentSongPlaying.sound.setVolume(volumeSlider.value / 100);

        (playSong)?setPlay():setPause();
    }
    // used when selecting a song from a song list.
    selectSong = (songId="", loadMethod) => {
        selectedSong = getSong(songId, loadMethod);

        // when selecting a new song from the list.
        if (currentSongId != null && songId != currentSongId) {
            setPause(); // pause previous song
            currentSongPlaying.sound.onended(() => {console.log('song ended without event')});
            currentSongPlaying.sound.stop();

            currentSongId = songId;
            currentSongPlaying = selectedSong;
            setPlay();
        } 
        // when toggling play for the same song.
        else if (currentSongId != null && songId == currentSongId) {
            togglePlay();
        } 

        currentSongPlaying.sound.setVolume(volumeSlider.value / 100);
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
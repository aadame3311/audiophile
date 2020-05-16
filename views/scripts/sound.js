
// Main master file for functions and
// variables used throughout this app
let brightnessMultiplier = 1;
let volume = 0.5;


let prevAmpLevel = 0;
let songIndex = 0;

let canPlayorPause = false;

let songSkipped = false;
let playToggled = false;
let alreadyStopped = false; // Prevents infinite callstack when a song ends

const pauseSong = (songToPause) => {
     
    songToPause.sound.pause();
    return;
}
const playSong = (songToPlay) => {
    promise = new Promise((resolve, reject) => {
        songToPlay.sound.play();
        resolve('success');
    });
    promise.then(()=> {
         
        playToggled = false;
    })
    
}

soundFunctions = (myp5) => {
    const handleEnd = () => {
        skipSong('forward');
    }

    // Event listeners
    $(playBtn).unbind();
    $(nextTrackBtn).unbind();
    $(prevTrackBtn).unbind();

    $(playBtn).on('click', () => {
        togglePlay();
    });
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
         
        playToggled = true;

        if (currentSongPlaying.sound.isPlaying()) {
            pauseSong(currentSongPlaying);
            setPlayIcon();

        } else {
            playSong(currentSongPlaying);
            setPauseIcon();
        }
    }
    // provides fine tuned control for pausing a song manually.
    const setPause = () => {
        if (currentSongPlaying.sound.isPlaying()) {
            pauseSong(currentSongPlaying);
            setPlayIcon();
        }
    }
    const setStop = () => {
        alreadyStopped = true;
        setPlayIcon();
        if (!currentSongPlaying.sound.isPaused()) {
             
            currentSongPlaying.sound.stop();
        }
    }
    // provides fine tuned control for playing a song manually.
    const setPlay = () => {
        alreadyStopped = false;

        if (!currentSongPlaying.sound.isPlaying()) {
            playSong(currentSongPlaying);
            setPauseIcon();
        }
    }
    const skipSong = direction => {
        if (songs.length > 0) {
            setStop();

            switch (direction) {
                case 'forward':
                    // reset to 0 when limit reached
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

            loadSong("", "index", true);
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


    /* meant to be used to store the sound object for a specific song.
         this way the song can be played on demand without needing to be loaded every time. */
    initSoundFile = (songId="", callback) => {
         
        var songToLoad = songs.find(song => song.uuid == songId);
        return myp5.loadSound(songToLoad.location, () => {
            loadSong(songId, "list", false);
            callback();
        });
    }
    // Set display song name and artist
    setSongDetails = (song) => {
        const songNameContainer = document.getElementById('song-name');
        const artistNameContainer = document.getElementById('artist-name');

        songNameContainer.textContent = song.name;
        artistNameContainer.textContent = song.artist;
    }
    // Resets song and artist name in the player to whichever song is currently playing
    const resetPlayerDisplay = () => {
        const songNameContainer = document.getElementById('song-name');
        const artistNameContainer = document.getElementById('artist-name');

        songNameContainer.textContent = (currentSongPlaying != null && currentSongPlaying.name)?currentSongPlaying.name:"";
        artistNameContainer.textContent = (currentSongPlaying != null && currentSongPlaying.artist)?currentSongPlaying.artist:"";
    }

    removeSong = songId => {
        var songToDelete = songs.find(song => song.uuid == songId);
        setStop();
        // Remove song from local list
        songs.splice(songToDelete.index, 1);

        // Reset song indices
        songs.forEach((song, i)=>{
            song.index = i;
        });

        if (songs.length == 0) {
            currentSongPlaying = null;
            resetPlayerDisplay();
        }
        else {
            skipSong("forward");
            setPause();
            resetPlayerDisplay();
        }

        // Update list on local storage
        localStorage.setItem("userSongs", songs);
        // Send message to backend so we can delete the sound file from src.
        socket.emit('RemoveSong', songToDelete);
        // Removes from the playlist modal view
        SongListModal.remove(songId);
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
        return songToLoad;
    }
    // used when loading a song from init (when imported)
    loadSong = (songId="", loadMethod, playSong=true) => {
         
        alreadyStopped = false;

        // If there is a song playing when a new one gets loaded, stop that song from playing.
        if (currentSongPlaying != null && currentSongPlaying.sound.isPlaying()) {
            setStop();
        }

        songToLoad = getSong(songId, loadMethod);
        songToLoad.sound.onended(() => {
             
            if (songs.length > 0) {
                if (!alreadyStopped && !currentSongPlaying.sound.isPaused()) {
                    handleEnd();
                }
            }
        });

        currentSongPlaying = songToLoad;
        currentSongId = songToLoad.uuid;

        // set volume
        currentSongPlaying.sound.setVolume(volumeSlider.value / 100);

        (playSong)?setPlay():setPause();
    }

    // used when selecting a song from a song list.
    selectSong = (songId="", loadMethod) => {
        selectedSong = getSong(songId, loadMethod);
        songIndex = selectedSong.index;
        // when selecting a new song from the list.
        if (currentSongId != null && songId != currentSongId) {
            if (currentSongPlaying.sound.isPlaying()){
                 
                setStop();
            }
            currentSongId = songId;
            currentSongPlaying = selectedSong;
            togglePlay();
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
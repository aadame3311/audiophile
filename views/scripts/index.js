
window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (check) {
        // on mobile, show "mobile version not available at the moment".
        $("body#app").remove();
        $(".main-container").css("height", "100%")
        $(".main-container").html('<div style="text-align: center; font-size: 50px; height: 100%; display: flex; align-items: center; justify-content: center;" id="mobile-message"> Sorry! Mobile version is not available at this moment :( </div>');
    } 
};
window.mobilecheck();


    $(playBtn).on('click', () => {
        if (songs.length == 0) {
            dismissSnackbars('error');
            SnackBar.create({
                type: 'info',
                message: '&#128712; ' + "Please import songs via the settings menu" + ' &#128712;',
                auto_dismiss: true
            });
        }
        else {
            togglePlay();
        }
    });
    nextTrackBtn.addEventListener('click', () => {
        if (songs.length <= 1) {
            dismissSnackbars('error');
            SnackBar.create({
                type: 'info',
                message: '&#128712; ' + "Please import more songs via the settings menu" + ' &#128712;',
                auto_dismiss: true
            });
        }
        else {
            songSkipped = true;
            skipSong('forward');
        }
    });
    prevTrackBtn.addEventListener('click', () => {
        if (songs.length <= 1) {
            dismissSnackbars('error');
            SnackBar.create({
                type: 'info',
                message: '&#128712; ' + "Please import more songs via the settings menu" + ' &#128712;',
                auto_dismiss: true
            });
        }
        else {
            songSkipped = true;
            skipSong('backward');
        }
    });

// set default volume
volumeSlider.value = 25;
volumeDisplayValue.textContent = volumeSlider.value;
volumeSlider.oninput = () => {
    let volumeValue = volumeSlider.value / 100; // 0 (silent) to 1 (full volume)
    volumeDisplayValue.textContent = volumeSlider.value;
    if (currentSongPlaying.sound != null) {
        currentSongPlaying.sound.setVolume(volumeValue)
    }
}

// toggles view of settings panel
const toggleSettingsPanelView = () => {
    switch (isSettingsOpen) {
        case true:
            // close panel
            settingsBtn.style.opacity = "0.75";
            settingsPanel.classList.remove("open-settings-animation")
            settingsPanel.classList.add("close-settings-animation")
            isSettingsOpen = false;
            break;
        case false:
            // open panel
            settingsBtn.style.opacity = "1";
            settingsPanel.classList.remove("close-settings-animation");
            settingsPanel.classList.add("open-settings-animation");
            isSettingsOpen = true;
            break;
    }
}

// change css class so that the theme changes can take effect
const changeThemeClass = (object, themeClass) => {
    var startsWith = "theme"; 
    var classes = object.className.split(" ").filter(function(v) { 
        return v.lastIndexOf(startsWith, 0) !== 0; 
    }); 
    object.className = classes.join(" ").trim(); 
    object.classList.add(themeClass);
}


settingsBtn.addEventListener('click', () => {
    toggleSettingsPanelView();
});
mySongsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    SongListModal.toggle();
});
$("#modal-exit-icon").click((e) => {
    e.preventDefault();
    SongListModal.hide();
});

// add event listeners to change theme when clicking on theme selectors
const addThemeChangeEventListeners = () => {
    for (i = 0; i < themeSelectors.length; i++) {
    
        // the color attributes are set in custom attributes in each theme selector DOM object
        let currThemeSelector = themeSelectors[i];
        themeSelectors[i].addEventListener('click', () => {
             
            selectedThemeColor = {
                name: currThemeSelector.getAttribute('color-name'),
                primary: currThemeSelector.getAttribute('primary').split(','),
                foreground: currThemeSelector.getAttribute('foreground').split(','),
                background: currThemeSelector.getAttribute('background').split(','),
            }
            let themeClass = `theme-${selectedThemeColor['name']}`;
            
            changeThemeClass(body, themeClass);

            // player controls
            changeThemeClass(playBtn, themeClass);
            changeThemeClass(nextTrackBtn, themeClass);
            changeThemeClass(prevTrackBtn, themeClass);
    
            // song/artist name
            changeThemeClass(songName, themeClass);
            changeThemeClass(artistName, themeClass);
    
            // settings
            changeThemeClass(volumeSlider, themeClass);
            changeThemeClass(settingsBtn, themeClass);
            changeThemeClass(settingsPanel, themeClass);
            changeThemeClass(dispStyleSelector, themeClass);

            // createplaylist btn
            changeThemeClass(uploadYTLink, themeClass);

            // mysongs btn
            changeThemeClass(mySongsBtn, themeClass);

            // change theme for all text inputs.
            changeThemeClass(textInput[0], themeClass);

            // change theme for song list modal
            changeThemeClass(songListModal, themeClass);
        });
    }
};
// add event listener to change display style
const addDisplayStyleSelectorEventListener = () => {
    dispStyleSelector.addEventListener('change', () => {
        selDrawOption = dispStyleSelector.value;
    })
};

// execute functions on init
addThemeChangeEventListeners();
addDisplayStyleSelectorEventListener();


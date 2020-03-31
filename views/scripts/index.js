// set default volume
volumeSlider.value = 10;
volumeDisplayValue.textContent = volumeSlider.value;
volumeSlider.oninput = () => {
    let volumeValue = volumeSlider.value / 100; // 0 (silent) to 1 (full volume)
    volumeDisplayValue.textContent = volumeSlider.value;
    sound.setVolume(volumeValue)
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

// add event listeners to change theme when clicking on theme selectors
const addThemeChangeEventListeners = () => {
    for (i = 0; i < themeSelectors.length; i++) {
    
        // the color attributes are set in custom attributes in each theme selector DOM object
        let currThemeSelector = themeSelectors[i];
        themeSelectors[i].addEventListener('click', () => {
            console.log('change theme');
            selectedThemeColor = {
                name: currThemeSelector.getAttribute('color-name'),
                primary: currThemeSelector.getAttribute('primary').split(','),
                foreground: currThemeSelector.getAttribute('foreground').split(','),
                background: currThemeSelector.getAttribute('background').split(','),
            }
            let themeClass = `theme-${selectedThemeColor['name']}`;
    
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


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

class SongListModal {
    static show() {
        $("#songlist-container").css("display", "block");
    }
    static hide() {
        $("#songlist-container").css("display", "none");
    }
    static toggle() {
        if (SongListModal.isOn()) {
            SongListModal.hide();
        } else {
            SongListModal.show();
        }
    }
    static isOn() {
        return songListModalContainer.css("display") == "block";
    }
    static append(songItem) {
        // push new song item to the DOM song list modal
        let DOMSongItem = $(`<div id='${songItem.uuid}' class='song-item'> <div onclick="selectSong('${songItem.uuid}', 'list')">`+
            `<i class="songitem-play-icon fas fa-play fa-lg"></i></div> <div class="song-item-contents">`+
            `<span class="song-name">${songItem.name}</span> <span class="song-artist">${songItem.artist}</span></div>`+
            `<div class="trash-icon-container" onclick="removeSong('${songItem.uuid}', 'list')"> <i class="fas fa-trash"></i></div></div>`)
        $(".song-list").append(DOMSongItem);
    }
    static remove(songId) {
        console.log(`removing ${songId}`)
        $(`#${songId}`).remove();
    }
} 
export default class Mixer {
    constructor(soundLog) {
        this.backgroundSong = 0;
        this.musicVolume = 0.2;
        this.soundVolume = 1;
        this.soundLog = soundLog;
        
    }
    play(song, volume = this.soundVolume) {
        if (song != 0) { 
            this.soundLog[song].pause();
            this.soundLog[song].currentTime = 0;
            this.soundLog[song].volume = volume;
            this.soundLog[song].play(); 
        }
    }
    stop(song) {
        if (song != 0) { 
            this.soundLog[song].pause();
            this.soundLog[song].currentTime = 0;
        }
    }
    changeBackground (song = this.backgroundSong) {
        try {this.stop(this.backgroundSong);} catch {}
        if (song === this.backgroundSong) {
            try {this.backgroundSong = (song) % 4+1;}
            catch {this.backgroundSong = 1;}
            
        } else {
            this.backgroundSong = song;
        }
        if (this.backgroundSong != 0) {
            this.soundLog[this.backgroundSong].loop = true; 
            this.play(this.backgroundSong, this.musicVolume);
        }
    }
}
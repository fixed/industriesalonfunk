define([
	'mixer/audio',
	'mixer/video'
],function(AudioMixer, VideoMixer){

	function Mixer(){
		this.audio = null;
		this.video = null;
	};

	Mixer.prototype.init = function(){
		this.audio = new AudioMixer();
		this.video = new VideoMixer();
	};

	Mixer.prototype.onTune = function(value) {
		this.audio.onTune(value);
		this.video.onTune(value);
	}

	return new Mixer();
});
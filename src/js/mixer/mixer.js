define([
	'mixer/audio',
	'mixer/video'
],function(AudioMixer, VideoMixer){

	function Mixer(){
		this.audio = null;
		this.video = null;
	}

	Mixer.prototype.init = function(options) {
		this.audio = new AudioMixer(options.statics.audio);
		this.video = new VideoMixer(options.statics.video);
	};

	Mixer.prototype.onTune = function(value) {
		this.audio.onTune(value);
		this.video.onTune(value);
	}

	return new Mixer();
});
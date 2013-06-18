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

	return new Mixer();
});
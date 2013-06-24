define([
],function(){

	function AudioMixer(statics) {
		this.context = new (window.AudioContext || window.webkitAudioContext)();

		this.staticsGain = this.context.createGain();
		this.stationGain = this.context.createGain();
		this.masterGain = this.context.createGain();
		this.compressor = this.context.createDynamicsCompressor();

		this.stationGain.connect(this.masterGain);
		this.staticsGain.connect(this.masterGain);
		this.masterGain.connect(this.compressor);
		this.compressor.connect(this.context.destination);
	};

	AudioMixer.prototype.attachSource = function(source){
		source.connect(this.stationGain);
	};

	AudioMixer.prototype.detachSource = function(source){
		source.disconnect();
	};

	AudioMixer.prototype.onTune = function(value) {
		this.staticsGain.gain.value = 1.0 - value;
	};

	return AudioMixer;
});
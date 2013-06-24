define([
],function(){

	function AudioMixer(statics) {
		this.context = new (window.AudioContext || window.webkitAudioContext)();

		this.compressor = this.context.createDynamicsCompressor();
		this.masterGain = this.context.createGain();

		this.masterGain.connect(this.compressor);
		this.compressor.connect(this.context.destination);
	};

	AudioMixer.prototype.attachSource = function(source){
		source.connect(this.masterGain);
	};

	AudioMixer.prototype.detachSource = function(source){
		source.disconnect();
	};

	AudioMixer.prototype.onTune = function(value) {
		// Produce statics ..
	}

	return AudioMixer;
});
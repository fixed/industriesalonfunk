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

		var now = this.context.currentTime;
		source.gain.cancelScheduledValues(now);
		source.gain.setValueAtTime(0, now);
		source.gain.linearRampToValueAtTime(1, now + 3);
	};

	AudioMixer.prototype.detachSource = function(source){

		var now = this.context.currentTime;
		source.gain.cancelScheduledValues(now);
		source.gain.setValueAtTime(source.gain.value, now);
		source.gain.linearRampToValueAtTime(0, now + 0.5);
	};

	AudioMixer.prototype.onTune = function(value) {
		this.staticsGain.gain.value = 1.0 - value;
	};

	return AudioMixer;
});
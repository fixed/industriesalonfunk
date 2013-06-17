define([
	'mixer/base'
	, 'util/class'
],function(Mixer,Class){

	function AudioMixer(){
		Mixer.call(this);
	};

	Class.inherits(AudioMixer,Mixer);

	AudioMixer.prototype.init = function(){
		this.compressor = audioContext.createDynamicsCompressor();
		this.masterGain = audioContext.createGain();

		this.masterGain.connect(this.compressor);
		this.compressor.connect(audioContext.destination);
	};

	AudioMixer.prototype.attachSource = function(source){
		source.connect(this.masterGain);
	};

	AudioMixer.prototype.detachSource = function(source){
		source.disconnect();
	};

	return new AudioMixer();
});
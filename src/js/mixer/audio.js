define([
], function(){

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

		// load statics
		var sample, sampleSource, osc, oscGain, playerGain;
		
		statics.files.forEach(function(url) {
			sample = new Audio(url);
			sample.loop = true;
			sample.src = url;
			sampleSource = this.context.createMediaElementSource(sample);
			osc = this.context.createOscillator();
			osc.frequency.value = Math.random();

			oscGain = this.context.createGain();
			oscGain.gain.value = 0.4;

			playerGain = this.context.createGain();

			osc.connect(oscGain);
			oscGain.connect(playerGain.gain);
			sampleSource.connect(playerGain);
			playerGain.connect(this.staticsGain);

			osc.start(0);
			sample.play();
		}, this);
	}

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
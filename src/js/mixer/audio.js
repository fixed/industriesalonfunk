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

		// load statics
		statics.files.forEach(function(url) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'arraybuffer';
			xhr.mixer = this;
			xhr.onload = function() {
				this.mixer._addStaticAudio(this.response);
			};
			xhr.send();
		}, this);
	}

	AudioMixer.prototype._addStaticAudio = function(buffer) {
		this.context.decodeAudioData(buffer, this._onAudioDecode.bind(this), this._onAudioDecodeError.bind(this));

	};

	AudioMixer.prototype._onAudioDecode = function(buffer) {
		if (!buffer) throw new Error('Could not decode AudioMixer statics audio');
		
		var player = this.context.createBufferSource();
		player.buffer = buffer;
		player.loop = true;

		var osc = this.context.createOscillator();
		osc.frequency.value = Math.random();

		var oscGain = this.context.createGain();
		oscGain.gain.value = 0.4;

		var playerGain = this.context.createGain();

		osc.connect(oscGain);
		oscGain.connect(playerGain.gain);
		player.connect(playerGain);
		playerGain.connect(this.staticsGain);

		osc.start(0);
		player.start(0);
	};

	AudioMixer.prototype._onAudioDecodeError = function(e) {
		throw e;
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
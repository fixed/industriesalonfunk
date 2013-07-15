define([
    'media/audio/effect/base',
    'util/class',
    'mixer/mixer'
],function(Effect, Class, mixer) {

	function Interference(options) {
		Effect.call(this,options);

		this.wet = mixer.audio.context.createGain();
		this.interferenceSoure = mixer.audio.context.createBufferSource();

		this.input.connect(this.output);
		this.interferenceSoure.connect(this.wet);
		this.wet.connect(this.output);

		if (!Interference.audioBuffer) {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', '/media/_statics/46728__freqman__radio-interfer.mp3', true);
			xhr.responseType = 'arraybuffer';

			var that = this;
			xhr.onload = function() {
				mixer.audio.context.decodeAudioData(xhr.response, that._onAudioDecode.bind(that), that._onAudioDecodeError.bind(that));
			};

			xhr.send();
		} else {
			this.interferenceSoure.buffer = Interference.audioBuffer;
			this.interferenceSoure.loop = true;
			this.interferenceSoure.start(0);
		}
	}

	Class.inherits(Interference,Effect);

	Interference.prototype._onAudioDecode = function(buffer) {
		if (!buffer) throw new Error('Could not decode Interference buffer');
		Interference.audioBuffer = buffer;
		this.interferenceSoure.buffer = Interference.audioBuffer;
		this.interferenceSoure.loop = true;
		this.interferenceSoure.start(0);
	};

	Interference.prototype._onAudioDecodeError = function(e) {
		throw e;
	};

	Interference.prototype.setWetLevel = function(val){
		this.wet.gain.value = val;
	};

	return Interference;
});
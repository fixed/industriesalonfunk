define([
	'media/base',
	'util/class',
	'media/audio/sample',
	'media/audio/effect/oldRadio',
	'media/audio/effect/distortion',
	'media/audio/effect/whiteNoise',
	'media/audio/effect/interference',
	'mixer/mixer'
],function(Media, Class, Sample, OldRadio, Distortion, WhiteNoise, Interference, mixer){

	var effects = {
		old : OldRadio,
		distortion : Distortion,
		whitenoise : WhiteNoise,
		interference : Interference
	};

	function AudioMedia(options) {
		Media.call(this);

		this._sample = new Sample(options.file);
		this._effects = [];
		this._output = this._sample; // main output
		this._volume = options.volume || 1;

		options.filters.forEach(function(properties) {

			var effect = this._createEffect(properties);
			this._output.connect(effect.input);
			this._effects.push(effect);
			this._output = effect;
			
		}, this);

		var gain = mixer.audio.context.createGain();
		gain.gain.value = this._volume;
		this._output.connect(gain);
		this._output = gain;
	}

	Class.inherits(AudioMedia,Media);

	AudioMedia.prototype._createEffect = function(properties) {
		var effectClass;

		if (effects[properties.name]) {
			effectClass = effects[properties.name];
		} else {
			throw new Error('Unknown audio effect: ' + properties.name);
		}

		return new effectClass({ min : properties.min, max : properties.max });
	};

	AudioMedia.prototype.load = function() {
		mixer.audio.attachSource(this._output);
		this._sample.play();
	};

	AudioMedia.prototype.unload = function() {
		mixer.audio.detachSource(this._output);
		this._sample.pause();
	};

	AudioMedia.prototype.tune = function(distVal) {
		this._effects.forEach(function(effect) {
			effect.tune(distVal);
		});

		this._output.gain.value = distVal * this._volume;
	};

	return AudioMedia;
});
define([
	'jquery',
	'media/base',
	'util/class',
	'media/video/effect/blackWhite',
	'media/video/effect/tvGlitch',
	'media/video/effect/noise',
	'media/video/effect/scanlines',
	'media/video/effect/sepia',
	'media/video/effect/bleachBypass',
	'mixer/mixer'
], function($, Media, Class, BlackWhite, TvGlitch, Noise, Scanlines, Sepia, BleachBypass, mixer) {

	var effects = {
		bw : BlackWhite,
		tvGlitch : TvGlitch,
		noise : Noise,
		scanlines : Scanlines,
		sepia : Sepia,
		bleachBypass : BleachBypass
	};

	function VideoMedia(options){
		Media.call(this);

		this._$video = $('<video loop src="'+options.file+'">');
		this._$video[0].volume = 0;

		this._effects = [];
		this._output = mixer.video.seriously.source(this._$video[0]);

		options.filters.forEach(function(properties, index){
			var effect = this._createEffect(properties);

			if (index > 0) {
				this._output.connect(effect);
			} else {
				effect.setInput(this._output);
			}

			this._effects.push(effect);
			this._output = effect;

		}, this);

	}

	Class.inherits(VideoMedia,Media);

	VideoMedia.prototype._createEffect = function(properties){
		var effectClass;
		if(effects[properties.name]){
			effectClass = effects[properties.name];
		} else{
			throw new Error('Unknown video effect: ' + properties.name);
		}

		return new effectClass({ min : properties.min, max : properties.max });
	};

	VideoMedia.prototype.load = function(){
		if (this._effects.length) {
			mixer.video.attachSource(this._output.getOutput());
		} else {
			mixer.video.attachSource(this._output);
		}
		this._$video[0].play();
	};

	VideoMedia.prototype.unload = function(){
		if (this._effects.length) {
			mixer.video.detachSource(this._output.getOutput());
		} else {
			mixer.video.detachSource(this._output);
		}
		this._$video[0].pause();
	};

	VideoMedia.prototype.tune = function(distVal){
		this._effects.forEach(function(effect){
			effect.tune(distVal);
		});
	};

	return VideoMedia;
});
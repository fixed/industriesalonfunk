define([
	'jquery',
	'media/base',
	'util/class',
	'util/requestAnimFrame',
	'media/video/effect/blackWhite',
	'media/video/effect/tvGlitch',
	'media/video/effect/noise',
	'media/video/effect/scanlines',
	'media/video/effect/sepia',
	'media/video/effect/bleachBypass',
	'mixer/mixer'
], function($, Media, Class, requestAnimFrame, BlackWhite, TvGlitch, Noise, Scanlines, Sepia, BleachBypass, mixer) {

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
		this._videoSource = mixer.video.seriously.source(this._$video[0]);

		this._effects = [];
		this._filters = options.filters;
		this._output = this._videoSource;
		this._loaded = false;
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
		this._filters.forEach(function(properties, index){
			var effect = this._createEffect(properties);

			if (index > 0) {
				this._output.connect(effect);
			} else {
				effect.setInput(this._output);
			}

			this._effects.push(effect);
			this._output = effect;

		}, this);


		if (this._effects.length) {
			mixer.video.attachSource(this._output.getOutput());
		} else {
			mixer.video.attachSource(this._output);
		}
		this._$video[0].play();

		// start renderloop for updating time based effects
		this._loaded = true;
		requestAnimFrame(this._onAnimFrame.bind(this));
	};

	VideoMedia.prototype.unload = function(){
		this._loaded = false;
		mixer.video.detachSource();
		
		// destroy effect nodes
		this._effects.forEach(function(effect) {
			effect.getOutput().destroy();
		});
		this._effects = [];

		this._output = this._videoSource;
		this._$video[0].pause();
	};

	VideoMedia.prototype._onAnimFrame =  function() {
		
		// update time based effects with the help of the audio context timer
		var now = mixer.audio.context.currentTime * 1000;
		this._effects.forEach(function(effect) {
			var effectNode = effect.getOutput();

			if ('time' in effectNode) {
				effectNode.time = now;
			} else if ('timer' in effectNode) {
				effectNode.timer = now;
			}
		});
		if(this._loaded) {
			requestAnimFrame(this._onAnimFrame.bind(this));
		}
	};

	VideoMedia.prototype.tune = function(distVal){
		this._effects.forEach(function(effect){
			effect.tune(distVal);
		});
	};

	return VideoMedia;
});
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

		this._file = options.file;
		this._currentTime = 0;
		this._output = null;

		this._effects = [];
		this._filters = options.filters;
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
		this._$video = $('<video loop src="' + this._file +'">');
		this._$video[0].volume = 0;

		// when loaded set currentTime
		this._$video.on('loadedmetadata', function(){
			if (this._$video){
				this._$video[0].currentTime = this._currentTime;
			}
		}.bind(this));
		
		this._output = mixer.video.seriously.source(this._$video[0]);

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
		this._currentTime = this._$video[0].currentTime;
		this._$video[0].pause();

		mixer.video.detachSource();
		
		// destroy effect nodes
		this._effects.forEach(function(effect) {
			effect.getOutput().destroy();
		});
		this._effects = [];

		this._$video.remove();
		delete(this._$video);
		this._$video = null;
		this._output = null;
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
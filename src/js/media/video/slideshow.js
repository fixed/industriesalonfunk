define([
	'jquery',
	'media/base',
	'mixer/mixer',
	'util/class',
	'util/requestAnimFrame',
	'media/video/effect/blackWhite',
	'media/video/effect/tvGlitch',
	'media/video/effect/noise',
	'media/video/effect/scanlines',
	'media/video/effect/sepia',
	'media/video/effect/bleachBypass',
	'lib/seriouslyjs/effects/seriously.blend'
], function($, Media, mixer, Class, requestAnimFrame, BlackWhite, TvGlitch, Noise, Scanlines, Sepia, BleachBypass) {

	var effects = {
		bw : BlackWhite,
		tvGlitch : TvGlitch,
		noise : Noise,
		scanlines : Scanlines,
		sepia : Sepia,
		bleachBypass : BleachBypass
	};

	function SlideShow(options) {
		Media.call(this);
		if (!options.files || options.files.length < 2) throw new Error('Slideshow needs at least two images.');

		this._images = [];
		this._currentImageIndex = 0; // currently shown image index
		this._nextImageBottom = true; // attach next image to bottom or top?
		this._loaded = false; // flag for renderLoop to continue or not

		options.files.forEach(function(imageUrl) {
			var img = new Image();
			img.src = imageUrl;
			this._images.push(img);
		}, this);

		this._blender = mixer.video.seriously.effect('blend');
		this._blender.top = mixer.video.seriously.source(this._images[0]);
		this._blendInterval = null; // save the JSInterval object for clearance in unLoad
		this._blendPause = options.interval || 5000; // pause between blendings

		this._effects = [];
		this._filters = options.filters;
		this._output = this._blender;
	}

	Class.inherits(SlideShow, Media);

	SlideShow.prototype._createEffect = function(properties) {
		var effectClass;

		if(effects[properties.name]){
			effectClass = effects[properties.name];
		} else{
			throw new Error('Unknown slideshow effect: ' + properties.name);
		}

		return new effectClass({ min : properties.min, max : properties.max });
	};

	SlideShow.prototype.load = function() {
		// create effects
		this._filters.forEach(function(properties, index){
			var effect = this._createEffect(properties);

			if (index > 0) {
				this._output.connect(effect);
			} else {
				effect.setInput(this._blender);
			}

			this._effects.push(effect);
			this._output = effect;
		}, this);

		// attach to mixer
		if (this._effects.length) {
			mixer.video.attachSource(this._output.getOutput());
		} else {
			mixer.video.attachSource(this._output);
		}

		// start renderloop for updating time based effects
		this._loaded = true;
		requestAnimFrame(this._onAnimFrame.bind(this));

		// start blend interval
		this._blendInterval = setInterval(function() {
			this._blend();
		}.bind(this), this._blendPause);
	};

	SlideShow.prototype.unload = function() {
		// detach source first
		mixer.video.detachSource();

		// clear interval and prevent animLoop from continuing
		clearInterval(this._blendInterval);
		this._loaded = false;

		// destroy effect nodes
		this._effects.forEach(function(effect) {
			effect.getOutput().destroy();
		});
		this._effects = [];

		// reset output
		this._output = this._blender;
	};

	SlideShow.prototype._blend = function() {

		// calc new image index
		this._currentImageIndex = ++this._currentImageIndex >= this._images.length ? 0 : this._currentImageIndex;
		
		var from = {}, to = {}; // need objects with properties for jQueries animate
		if (this._nextImageBottom) {

			// setup toBottom animation
			this._blender.bottom = mixer.video.seriously.source(this._images[this._currentImageIndex]);
			from.alpha = 1;
			to.alpha = 0;
		} else {

			// setup toTop animation
			this._blender.top = mixer.video.seriously.source(this._images[this._currentImageIndex]);
			from.alpha = 0;
			to.alpha = 1;
		}
		this._nextImageBottom = !this._nextImageBottom;

		// run the animation
		$(from).animate(to, {
			duration: 1000,
			step: function(val) { this._blender.opacity = val; }.bind(this)
		});
	};

	SlideShow.prototype._onAnimFrame =  function() {
		
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

	SlideShow.prototype.tune = function(distVal){
		this._effects.forEach(function(effect){
			effect.tune(distVal);
		});
	};

	
	return SlideShow;
});
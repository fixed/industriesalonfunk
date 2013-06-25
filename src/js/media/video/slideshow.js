define([
	'jquery',
	'media/base',
	'mixer/mixer',
	'util/class',
	'media/video/effect/blackWhite',
	'media/video/effect/tvGlitch',
	'lib/seriouslyjs/effects/seriously.blend'
], function($, Media, mixer, Class, BlackWhite, TvGlitch) {

	var effects = {
		bw : BlackWhite,
		tvGlitch : TvGlitch
	};

	function SlideShow(options) {

		if (options.files.length < 2) throw new Error('Slideshow needs at least two images.');
		Media.call(this);

		this._images = [];
		this._currentImageIndex = 0; // currently shown image index
		this._nextImageBottom = true; // attach next image to bottom or top?

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
		this._output = this._blender;

		options.filters.forEach(function(properties, index){
			var effect = this._createEffect(properties);

			if (index > 0) {
				this._output.connect(effect);
			} else {
				effect._effect.source = this._blender;
			}

			this._effects.push(effect);
			this._output = effect;
		}, this);
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
		if (this._effects.length) {
			mixer.video.attachSource(this._output._effect);
		} else {
			mixer.video.attachSource(this._output);
		}

		this._blendInterval = setInterval(function() {
			this._blend();
		}.bind(this), this._blendPause);
	};

	SlideShow.prototype.unload = function() {
		if (this._effects.length) {
			mixer.video.detachSource(this._output._effect);
		} else {
			mixer.video.detachSource(this._output);
		}

		clearInterval(this._blendInterval);
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

	SlideShow.prototype.tune = function(distVal){
		this._effects.forEach(function(effect){
			effect.tune(distVal);
		});
	};

	
	return SlideShow;
});
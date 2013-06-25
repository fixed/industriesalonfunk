define([
	'jquery',
	'media/base',
	'util/class',
	'media/video/effect/blackWhite',
	'media/video/effect/tvGlitch',
	'mixer/mixer',
],function($, Media, Class, BlackWhite, TvGlitch, mixer){

	var effects = {
		bw : BlackWhite,
		tvGlitch : TvGlitch
	};

	function VideoMedia(options){
		Media.call(this);

		this._$video = $('<video loop src="'+options.file+'">');
		this._$video[0].volume = 0;
		this._effects = [];

		options.filters.forEach(function(properties, index){
			var effect = this._createEffect(properties);
			this._effects.push(effect);
			if(index > 0) {
				this._effects[index - 1].connect(effect);
			} else {
				var sSource = mixer.video.seriously.source(this._$video[0]);
				this._effects[0]._effect.source = sSource;
			}
		}, this);

	};
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
		mixer.video.attachSource(this._effects[this._effects.length-1]._effect);
		this._$video[0].play();
	};

	VideoMedia.prototype.unload = function(){
		mixer.video.detachSource(this._$video[0]);
		this._$video[0].pause();
	};

	VideoMedia.prototype.tune = function(distVal){
		this._effects.forEach(function(effect){
			effect.tune(distVal);
		});
	};

	return VideoMedia;
});
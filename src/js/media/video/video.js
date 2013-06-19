define([
	'jquery',
	'media/base',
	'util/class',
	'mixer/mixer',
],function($, Media, Class, mixer){

	function VideoMedia(options){
		Media.call(this);

		this._$video = $('<video loop src="'+options.file+'">');
		this._$video[0].volume = 0;
		this._effects = [];

		options.filters.forEach(function(properties){

		}, this);

	};
	Class.inherits(VideoMedia,Media);

	VideoMedia.prototype._createEffect = function(properties){
	};

	VideoMedia.prototype.load = function(){
		mixer.video.attachSource(this._$video[0]);
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
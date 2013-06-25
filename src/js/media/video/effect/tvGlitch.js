define([
	'jquery',
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.tvglitch'
],function($, Effect, Class, mixer) {

	function TvGlitch(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('tvglitch');
	}
	Class.inherits(TvGlitch,Effect);

	TvGlitch.prototype.setWetLevel = function(val){
        this._effect.lineSync = val;
        this._effect.distortion = val;
        this._effect.scanlines = val;
    };

	return TvGlitch;
});
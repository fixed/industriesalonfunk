define([
	'jquery',
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.scanlines'
],function($, Effect, Class, mixer) {

	function Scanlines(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('scanlines');
	}
	Class.inherits(Scanlines,Effect);

	Scanlines.prototype.setWetLevel = function(val){
        this._effect.lines = val*60;
        this._effect.size = val;
        this._effect.intensity = val;
    };

	return Scanlines;
});
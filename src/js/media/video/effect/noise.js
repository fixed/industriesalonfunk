define([
	'jquery',
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.noise'
],function($, Effect, Class, mixer) {

	function Noise(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('noise');
	}
	Class.inherits(Noise,Effect);

	Noise.prototype.setWetLevel = function(val){
        this._effect.amount = val;
    };

	return Noise;
});
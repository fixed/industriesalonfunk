define([
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.hue-saturation'
],function(Effect, Class, mixer) {

	function BlackWhite(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('hue-saturation');
		this._effect.saturation = -1;
	}
	Class.inherits(BlackWhite,Effect);

	BlackWhite.prototype.setWetLevel = function(val){
        // not used for this filter
    };

	return BlackWhite;
});
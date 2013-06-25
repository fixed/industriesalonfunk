define([
	'jquery',
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.bleach-bypass'
],function($, Effect, Class, mixer) {

	function BleachBypass(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('bleach-bypass');
	}
	Class.inherits(BleachBypass,Effect);

	BleachBypass.prototype.setWetLevel = function(val){
        this._effect.amount = val;
    };

	return BleachBypass;
});
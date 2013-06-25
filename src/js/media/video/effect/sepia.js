define([
	'jquery',
    'media/video/effect/base',
    'util/class',
    'mixer/mixer',
	'lib/seriouslyjs/effects/seriously.sepia'
],function($, Effect, Class, mixer) {

	function Sepia(options){
		Effect.call(this,options);

		this._effect = mixer.video.seriously.effect('sepia');
	}
	Class.inherits(Sepia,Effect);

	Sepia.prototype.setWetLevel = function(val){
        // not used for this filter
    };

	return Sepia;
});
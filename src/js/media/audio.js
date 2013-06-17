define([
	'media/base'
	, 'util/class'
	, 'audio/sample'
	, 'audio/effect/OldRadio'
],function(Media,Class,Sample,OldRadio){

	var effects = {
		old : OldRadio
	};

	function AudioMedia(options){
		Media.call(this);

		this._sample = new Sample(options.file);
		this._effects = {};
		this._output = this._sample; // main output

		options.filters.forEach(function(properties){

			var effect = this._createEffect(properties);
			this._output.connect(effect.input);
			this._effects[properties.name] = this._output = effect;
		}, this);

	};
	Class.inherits(AudioMedia,Media);

	AudioMedia.prototype._createEffect = function(properties){
		var effectClass;
		if(effects[properties.name]){
			effectClass = effects[properties.name];
		} else{
			throw new Error('Unknown audio effect: ' + name);
		}

		return new effectClass({min : properties.min, max : properties.max });
	};

	return AudioMedia;
});
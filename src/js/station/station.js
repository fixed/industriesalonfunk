define([
	'util/class', 'eventEmitter', 'channel/distribution/sine', 'media/audio'
],function(Class, EventEmitter, Distribution, AudioMedia){

	function Channel(options) {
		EventEmitter.call(this);

		this.name = options.name;

		this.start = options.range[0];
		this.end = options.range[1];

		this.distribution = new Distribution({values: options.distribution});
		if(options.audio) this.audioMedia = new AudioMedia(options.audio);

		this.isActive = false;
	};
	Class.inherits(Channel, EventEmitter);
	
	Channel.prototype.load = function() {
		console.log('loading channel ' + this.name);
		this.isActive = true;
		if(this.audioMedia) this.audioMedia.load();
	};

	Channel.prototype.unload = function() {
		console.log('unloading channel ' + this.name);
		this.isActive = false;
		if(this.audioMedia) this.audioMedia.unload();
	};

	/**
	 * @param tune a value from 0 to 1 already in range
	 */
	Channel.prototype.onTune = function(tune) {
		var distVal = this.distribution.transform(tune);
		console.log(this.name + ' tune within range: ' + tune + 
			'. Value after distribution calculation: ' + distVal);
		if(this.audioMedia) this.audioMedia.tune(distVal);
	};

	return Channel;
});

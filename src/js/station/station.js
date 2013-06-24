define([
	'util/class', 
	'eventEmitter', 
	'station/distribution/sine', 
	'media/audio/audio',
	'media/video/video'
],function(
	Class, 
	EventEmitter, 
	Distribution, 
	AudioMedia,
	VideoMedia
){

	function Station(options) {
		EventEmitter.call(this);

		this.name = options.name;

		this.start = options.range[0];
		this.end = options.range[1];

		this.distribution = new Distribution({values: options.distribution});

		if(options.audio) this.audioMedia = new AudioMedia(options.audio);
		if(options.video) this.videoMedia = new VideoMedia(options.video);

		this.isActive = false;
	};
	Class.inherits(Station, EventEmitter);
	
	Station.prototype.load = function() {
		console.log('loading station ' + this.name);
		this.isActive = true;

		if(this.audioMedia) this.audioMedia.load();
		if(this.videoMedia) this.videoMedia.load();
	};

	Station.prototype.unload = function() {
		console.log('unloading station ' + this.name);
		this.isActive = false;

		if(this.audioMedia) this.audioMedia.unload();
		if(this.videoMedia) this.videoMedia.unload();
	};

	/**
	 * @param tune a value from 0 to 1 already in range
	 */
	Station.prototype.onTune = function(tune) {
		var distVal = this.distribution.transform(tune);
		console.log(this.name + ' tune within range: ' + tune + 
			'. Value after distribution calculation: ' + distVal);

		if(this.audioMedia) this.audioMedia.tune(distVal);
		if(this.videoMedia) this.videoMedia.tune(distVal);
		return distVal;
	};

	return Station;
});

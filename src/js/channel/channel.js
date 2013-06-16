define([
	'jquery', 'underscore', 'util/class', 'eventEmitter'
],function($, _, Class, EventEmitter){

	function Channel(options) {
		Class.super(this);

		this.name = options.name;

		this.start = options.range[0];
		this.end = options.range[1];

		this.distribution = options.distribution;

		this.isActive = false;
	};
	Class.inherits(Channel, EventEmitter);
	
	Channel.prototype.load = function() {
		console.log('loading channel ' + this.name);
		this.isActive = true;
	};

	Channel.prototype.unload = function() {
		console.log('unloading channel ' + this.name);
		this.isActive = false;
	};

	/**
	 * @param tune a value from 0 to 1 already in range
	 */
	Channel.prototype.onTune = function(tune) {
		console.log(this.name + ' tune within range: ' + tune);
	};

	return Channel;
});

define([
	'jquery', 'underscore', 'util/class', 'eventEmitter'
],function($, _, Class, EventEmitter){

	function Channel(options) {
		Class.super(this);
	};
	Class.inherits(Channel, EventEmitter);
	
	/**
	 * @param tune a value from 0 to 1 already in range
	 */
	Channel.prototype.onTune = function(tune) {

	}

	return Channel;
});
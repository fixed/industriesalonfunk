define([
],function(){

	function Media(options){
	};

	/**
	 * Starts the media playback. This includes connecting to the main mixer.
	 */
	Media.prototype.load = function(){
		throw(new Error('You need to implement this method in a subclass.'));
	};

	/**
	 * Tunes the media event with a given distribution value. Use this value
	 * to apply a wet_value to each of the applied effects according to their
	 * min/max values.
	 */
	Media.prototype.tune = function(distValue){
		throw(new Error('You need to implement this method in a subclass.'));
	};

	/**
	 * Stops the media playback and disconnects the media from the main mixer
	 */
	Media.prototype.unload = function(){
		throw(new Error('You need to implement this method in a subclass.'));
	};
	
	return Media;
});
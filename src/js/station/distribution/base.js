define([
],function(){

	function Distribution(options) {
		this.values = options.values;
	};

	/**
	 * Returns a value between 0 and 1 based on its configuration and the given value.
	 */
	Distribution.prototype.transform = function(value) {
		throw(new Error('You need to implement this method in a subclass.'));
	}

	/**
	 * @protected
	 */
	Distribution.prototype._normalize = function(value, lower, upper) {
		return (value - lower) / (upper - lower);
	}
	
	return Distribution;
});

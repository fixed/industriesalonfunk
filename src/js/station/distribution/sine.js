define([
	'util/class', 'station/distribution/base'
],function(Class, Distribution){

	/**
	 * Needs an array of 3 or 4 floats between 0 and 1 in order.
	 * If given 3 elements, the second element will be interpreted as peak 
	 * whereas the first and last one are treated as start and end values, respectively.
	 * If given 4 elements, values between the second and third element will always return 1.
	 */ 
	function SineDistribution(options) {
		Distribution.call(this, options);

		this.hasContinuousPeak = this.values.length > 3;
		
		this.start = this.values[0];
		this.peak = this.values[1];
		this.peakEnd = this.hasContinuousPeak ? this.values[2] : this.values[1];
		this.end = this.hasContinuousPeak ? this.values[3] : this.values[2];
	};
	Class.inherits(SineDistribution, Distribution);


	SineDistribution.prototype.transform = function(value) {
		var result = 0;

		if(value < this.start || value > this.end) return result;

		if(value < this.peak) 
			result = Math.cos(Math.PI + Math.PI * this._normalize(value, this.start, this.peak) );
		else if(this.hasContinuousPeak && value < this.peakEnd) 
			return 1;
		else result = Math.cos(Math.PI * this._normalize(value, this.peakEnd, this.end) );
		
		return (result + 1) / 2;
	}

	return SineDistribution;
});

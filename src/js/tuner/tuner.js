define([
	'jquery', 'util/class', 'eventEmitter', 'tuner/ui', 'js/lib/jquery/jquery.mousewheel.js' 
],function($, Class, EventEmitter, TunerUi){

	/**
	 * Emits 'tune' with current absolute tune value between 0 and 1.
	 */
	function Tuner() {
		EventEmitter.call(this);

		this.currentValue = 0;
		this.maxValue = 0x70;

	};
	Class.inherits(Tuner, EventEmitter);


	Tuner.prototype.init = function(options) {
		var self = this;
		$(window).mousewheel(function(event, delta) {
			self.onMouseWheel(delta);
			return false;
		});

		this.ui = new TunerUi(options);
	};

	Tuner.prototype.clamp = function(val, min, max) {
		return Math.max(min, Math.min(max, val));
	};

	Tuner.prototype.onMouseWheel = function(delta) {
		this.currentValue = this.clamp(this.currentValue + delta, 0, this.maxValue);
		var normalizedValue = this.currentValue / this.maxValue;
		this.emit('tune', normalizedValue);
		if(this.ui) this.ui.moveIndicator(normalizedValue);
	};
	

	return new Tuner(); // It's a singleton
});

define([
	'jquery', 'underscore', 'util/class', 'eventEmitter', 'js/lib/jquery/jquery.mousewheel.js'
],function($, _, Class, EventEmitter){

	/**
	 * Emits 'tune' with current absolute tune value between 0 and 1.
	 */
	function Tuner() {
		Class.super(this);

		this.currentValue = 0;

		this.maxValue = 0x70;

		this.$element = $('#tuner');

		this.$indicator = $('#indicator');
	};
	Class.inherits(Tuner, EventEmitter);


	Tuner.prototype.init = function(options) {
		var self = this;
		this.$element.mousewheel(function(event, delta) {
			self.onMouseWheel(delta);
			return false;
		});

		if(options.channels) this.drawChannels(options.channels);
	};


	Tuner.prototype.drawChannels = function(channels) {
		channels.forEach(function(channel) {
			var $channel = $('<div class="channel">').prependTo(this.$element);
			console.log($channel);
			$channel.css('left', channel.range[0] * this.$element.width());
			$channel.css('width', this.$element.width() * (channel.range[1] - channel.range[0]) );
			$channel.html('<span>'+channel.name+'</span>');
		}, this);
	};


	Tuner.prototype.clamp = function(val, min, max) {
		return Math.max(min, Math.min(max, val));
	};

	Tuner.prototype.onMouseWheel = function(delta) {
		this.currentValue = this.clamp(this.currentValue + delta, 0, this.maxValue);
		var normalizedValue = this.currentValue / this.maxValue;

		this.$indicator.css('left', this.$element.width() * normalizedValue);
		this.emit('tune', normalizedValue);
	};
	

	return new Tuner(); // It's a singleton
});
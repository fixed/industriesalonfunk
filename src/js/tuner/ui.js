define([
	'jquery', 'js/lib/jquery/jquery.mousewheel.js'
],function($){

	function TunerUi(options) {
		this.$element = $('#tuner');
		this.$indicator = $('#indicator');

		if(options.channels) this.drawChannels(options.channels);
	};

	TunerUi.prototype.drawChannels = function(channels) {
		channels.forEach(function(channel) {
			var $channel = $('<div class="channel">').prependTo(this.$element);
			console.log($channel);
			$channel.css('left', channel.range[0] * this.$element.width());
			$channel.css('width', this.$element.width() * (channel.range[1] - channel.range[0]) );
			$channel.html('<span>'+channel.name+'</span>');
		}, this);
	};

	TunerUi.prototype.moveIndicator = function(value) {
		this.$indicator.css('left', this.$element.width() * value);
	};
	

	return TunerUi;
});
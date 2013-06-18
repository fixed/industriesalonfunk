define([
	'jquery', 'js/lib/jquery/jquery.mousewheel.js'
],function($){

	function TunerUi(options) {
		this.$element = $('#tuner');
		this.$indicator = $('#indicator');

		if(options.stations) this.drawstations(options.stations);
	};

	TunerUi.prototype.drawstations = function(stations) {
		stations.forEach(function(station) {
			var $station = $('<div class="station">').prependTo(this.$element);
			console.log($station);
			$station.css('left', station.range[0] * this.$element.width());
			$station.css('width', this.$element.width() * (station.range[1] - station.range[0]) );
			$station.html('<span>'+station.name+'</span>');
		}, this);
	};

	TunerUi.prototype.moveIndicator = function(value) {
		this.$indicator.css('left', this.$element.width() * value);
	};
	

	return TunerUi;
});

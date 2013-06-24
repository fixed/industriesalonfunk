define([
	'station/station',
	'mixer/mixer'
],function(Station, Mixer) {

	function Receiver(options) {
		this.stations = [];
	}
	
	Receiver.prototype.init = function(options) {
		options.stations.forEach(function(stationOptions) {
			this.stations.push(new Station(stationOptions));
		}, this);
	};

	/**
	 * @param value a tuning value from 0 to 1
	 */
	Receiver.prototype.onTune = function(value) {
		var tuning = 0;
		this.stations.forEach(function(station) {
			if(!station.isActive) {
				if(value > station.start && value < station.end)
					station.load();
			}
			if(station.isActive) {
				if(value < station.start || value > station.end)
					station.unload();
				else {
					tuning += station.onTune((value - station.start) / (station.end - station.start));
				}
			}
		}, this);
		return tuning;
	};

	return new Receiver(); // It's a singleton.
});

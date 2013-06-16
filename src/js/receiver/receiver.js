define([
	'channel/channel'
],function(Channel){

	function Receiver(options) {
		this.channels = [];
	};
	
	Receiver.prototype.init = function(options) {
		options.channels.forEach(function(channelOptions) {
			this.channels.push(new Channel(channelOptions));
		}, this);
	}

	/**
	 * @param value a tuning value from 0 to 1
	 */
	Receiver.prototype.onTune = function(value) {
		this.channels.forEach(function(channel) {
			if(!channel.isActive) {
				if(value > channel.start && value < channel.end)
					channel.load();
			}
			if(channel.isActive) {
				if(value < channel.start || value > channel.end)
					channel.unload();
				else {
					channel.onTune((value - channel.start) / (channel.end - channel.start));
				}
			}
		}, this);
	}

	return new Receiver(); // It's a singleton.
});

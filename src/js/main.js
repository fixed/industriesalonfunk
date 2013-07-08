require.config({
	//baseUrl : '',
	paths : {
		'jquery' : 'lib/jquery/jquery-1.9.1.min',
		'plugins' : 'lib/requirejs/plugins',
		'seriously' : 'lib/seriouslyjs/seriously',
		'eventEmitter' : 'lib/eventEmitter/eventEmitter',
		'underscore' : 'lib/underscore/underscore',
		'util' : 'lib/util'
	}
});

require([
	'plugins/domReady',
	'tuner/tuner',
	'station/receiver',
	'mixer/mixer'
],function(domReady, tuner, receiver, mixer){
	domReady(function(){

		$.getJSON('../config_test.json').success(function(config){

			mixer.init({
				statics : config.statics
			});

			tuner.init({
				stations : config.stations,
				fullScreenSel : '#page'
			});

			receiver.init({
				stations : config.stations
			});

			tuner.on('tune', function(value) {
				var summedTune = receiver.onTune(value);
				console.log('Summed tune value after tuning stations: ' + summedTune);
				mixer.onTune(summedTune);
			});

		}).fail(function(error) {
			alert('Could not load configuration');
		});
	});
});

require.config({
	//baseUrl : '',
	paths : {
		'jquery' : 'lib/jquery/jquery-1.9.1.min',
		'plugins' : 'lib/requirejs/plugins',
        'eventEmitter' : 'lib/eventEmitter/eventEmitter',
        'underscore' : 'lib/underscore/underscore',
        'util' : 'lib/util'
	}
});

require([
	'plugins/domReady',
	'tuner/tuner',
	'receiver/receiver',
	'mixer/audio'
],function(domReady, tuner, receiver, audioMixer){
	domReady(function(){

		$.getJSON('../config_test.json').success(function(config){

			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			window.audioContext = new AudioContext();
			
			audioMixer.init();

			tuner.init({
				channels : config.channels
			});

			receiver.init({
				channels : config.channels
			});

			tuner.on('tune', function(value) {
				receiver.onTune(value);
			});

		}).fail(function(error) {
			alert('Could not load configuration')
		});

	});
});

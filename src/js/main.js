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

require(['plugins/domReady', 'tuner/index'],function(domReady, tuner){
	domReady(function(){

		$.getJSON('../config_test.json').success(function(data){
			
			tuner.init({
				channels : data.channels
			});

			tuner.on('tune', function(value) {
				console.log(value);
			})

		}).fail(function(error) {
			alert('Could not load configuration')
		});

	});
});
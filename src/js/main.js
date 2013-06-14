require.config({
	//baseUrl : '',
	paths : {
		'jquery' : 'lib/jquery/jquery-1.9.1.min',
		'plugins' : 'lib/requirejs/plugins'
	}
});

require(['plugins/domReady', 'tuner/index'],function(domReady, tuner){
	domReady(function(){
		
		tuner.init();

	});
});
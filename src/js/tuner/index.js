define([
	'jquery'
],function($){

	function Tuner() {

	};

	Tuner.prototype.init = function(options) {
		$.getJSON('../config_test.json', function(data){
			console.log(data);
		});
	}

	Tuner.prototype.onWheel = function(event) {

	};

	

	return new Tuner(); // It's a singleton
});
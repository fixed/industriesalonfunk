define([
],function(){

	function Mixer(){

	};

	Mixer.prototype.init = function(){
		throw(new Error('You need to implement this method in a subclass.'));
	};

	Mixer.prototype.attachSource = function(source) {
		throw(new Error('You need to implement this method in a subclass.'));
	};

	Mixer.prototype.detachSource = function(){
		throw(new Error('You need to implement this method in a subclass.'));
	};

	return Mixer;
});
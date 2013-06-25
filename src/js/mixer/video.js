define([
	'jquery',
	'seriously',
	'lib/seriouslyjs/effects/seriously.fader'
],function($, Seriously){

	function VideoMixer() {

		this._$target = $('#video');
		this._$target.attr('width', this._$target.width()); // Seriously.js needs that
		this._$target.attr('height', this._$target.height()); // or output becomes pixely

		this.seriously = new Seriously();
		// Unfortunately, we can't just mix videos together, we need the "blend" effect of Seriously
		// which also supports only two sources. I chose fader (default: black) for simplicity, now.

		this._mixNode = this.seriously.effect('fader');

		this._targetNode = this.seriously.target(this._$target[0]);
		this._targetNode.source = this._mixNode;

		var status = Seriously.incompatible();
		if(status) {
			console.log(status);
			// alert('Seriously.js encountered a problem, status was: ' + status);
		} else {
			this.seriously.go();
		}
	};

	VideoMixer.prototype.attachSource = function(source) {
		this._mixNode.source = source;
		this._mixNode.amount = 0;
	}

	VideoMixer.prototype.detachSource = function(source) {
		this._mixNode.source = null;
		this._mixNode.amount = 1;
	}

	VideoMixer.prototype.onTune = function(value) {
		// Produce statics ..
	}


	return VideoMixer;
});
define([
	'jquery',
	'seriously',
	'lib/seriouslyjs/effects/seriously.blend',
	'lib/seriouslyjs/effects/seriously.fader'
],function($, Seriously){

	function VideoMixer(statics) {
		/*
		this.seriously = new Seriously();

		// Unfortunately, we can't just mix videos together, we only have the "blend" effect
		// of Seriously as an option, which supports only two sources.
		this._mixNode = this.seriously.effect('blend');
		this._$statics = [];
		this._$currentStatic;
		this._oldTuneValue = 0;

		if (statics.files.length > 0) {

			statics.files.forEach(function(url) {
				var el = $('<video loop src="' + url + '">');
				this._$statics.push(el);
			}, this);

			// currently picks one random static video.
			// One might consider to get something in place that picks another random one
			// when the noise was mixed out
			
			var $staticEl = this._getRandomStaticEl();
			this._mixNode.top = this.seriously.source($staticEl[0]);
			$staticEl[0].play();
			this._$currentStatic = $staticEl;
		}
		*/


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

		if (status) {
			console.log(status);
			// alert('Seriously.js encountered a problem, status was: ' + status);
		} else {
			this.seriously.go();
		}
	}

	VideoMixer.prototype.attachSource = function(source) {
		this._mixNode.source = source;
		this._mixNode.amount = 0;
	
		this._mixNode.bottom = this.seriously.source(source);
	};

	VideoMixer.prototype.detachSource = function(source) {
		this._mixNode.bottom = null;
	};

	VideoMixer.prototype._getRandomStaticEl = function() {
		var index = Math.floor(Math.random() * this._$statics.length);
		index = index === this._$statics.length ? index - 1 : index;

		return this._$statics[index];
	};

	VideoMixer.prototype.onTune = function(value) {
		// Produce statics ..
		this._mixNode.opacity = 1 - value;
		if (value === 1 && this._oldTuneValue != 1 && this._$statics.length > 0) {

			this._$currentStatic[0].pause();
			this._$currentStatic = this._getRandomStaticEl();
			this._mixNode.top = this.seriously.source(this._$currentStatic[0]);
			this._$currentStatic[0].play();
		}
		this._oldTuneValue = value;
	};


	return VideoMixer;
});
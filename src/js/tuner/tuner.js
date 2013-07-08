define([
	'jquery', 'util/class', 'eventEmitter', 'tuner/ui', 'js/lib/jquery/jquery.mousewheel.js' 
],function($, Class, EventEmitter, TunerUi){

	/**
	 * Emits 'tune' with current absolute tune value between 0 and 1.
	 */
	function Tuner() {
		EventEmitter.call(this);

		this.currentValue = 0;
		this.maxValue = 0x70;

	}
	Class.inherits(Tuner, EventEmitter);


	Tuner.prototype.init = function(options) {
		if (!options.fullScreenSel) throw new Error('Missing selector for fullscreen functionality!');
		
		this._fullScreenElement = $(options.fullScreenSel)[0];
		
		$(window).mousewheel(this.onMouseWheel.bind(this));
		$(window).on('keyup', this.onKeyUp.bind(this));
		$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', this.toggleCursorVisibility.bind(this));

		this.ui = new TunerUi(options);
	};

	Tuner.prototype.clamp = function(val, min, max) {
		return Math.max(min, Math.min(max, val));
	};

	Tuner.prototype.onMouseWheel = function(event, delta) {
		this.currentValue = this.clamp(this.currentValue + delta, 0, this.maxValue);
		var normalizedValue = this.currentValue / this.maxValue;
		this.emit('tune', normalizedValue);
		if(this.ui) this.ui.moveIndicator(normalizedValue);
		return false;
	};

	Tuner.prototype.onKeyUp = function(event) {
		if (event.ctrlKey && event.keyCode === 70) {
			if (!document.fullScreen) {

				if (this._fullScreenElement.requestFullScreen) {
					this._fullScreenElement.requestFullScreen();

				} else if (this._fullScreenElement.webkitRequestFullScreen) {
					this._fullScreenElement.webkitRequestFullScreen();

				} else if (this._fullScreenElement.mozRequestFullScreen) {
					this._fullScreenElement.mozRequestFullScreen();
				}
			}
		}
	};

	Tuner.prototype.toggleCursorVisibility = function() {
		$('body').toggleClass('hide-cursor');
	};
	

	return new Tuner(); // It's a singleton
});

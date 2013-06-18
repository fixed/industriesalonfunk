define([
    'media/audio/effect/base'
    , 'util/class'
    , 'mixer/mixer'
],function(Effect,Class,mixer){

	function tanh(val){
		var exp = Math.exp(val);
		var expNeg = Math.exp(-val);
		return (exp - expNeg) / (exp + expNeg);
	}

	function Distortion(options){
		Effect.call(this,options);

		this.noOfSamples = 8192;
		this.value = this.min;

		this.waveShaper = mixer.audio.context.createWaveShaper();
        this.input.connect(this.waveShaper);
        this.waveShaper.connect(this.output);

        this.waveShaper.curve = this._calculateCurve(this.value);
	}
	Class.inherits(Distortion,Effect);

	Distortion.prototype._calculateCurve = function(amount){
		var curve = new Float32Array(this.noOfSamples);
		var i, x, y, a = 1 - amount;
		for(i = 0; i < this.noOfSamples; i++) {
		    x = i * 2 / this.noOfSamples - 1;
		    y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a);
		    curve[i] = tanh(y * 2);
		}

        return curve;
	};

	Distortion.prototype.setWetLevel = function(val){
        if(val > 1 || val < 0) throw new Error('WetLevel parameter out of range: 0 <= ' + val + ' <= 1' );

        if(val != this.value){
        	this.value = val;
        	this.waveShaper.curve = this._calculateCurve(this.value);
        }
    };

	return Distortion;
});
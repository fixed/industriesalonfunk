define([
    'media/audio/effect/base'
    , 'util/class'
    , 'mixer/mixer'
],function(Effect,Class,mixer){

	function WhiteNoise(options){
		Effect.call(this,options);

        this.wet = mixer.audio.context.createGain();
        this.noiseGen = mixer.audio.context.createBufferSource();
        this.filter = mixer.audio.context.createBiquadFilter();

        this.input.connect(this.output);
        this.noiseGen.connect(this.filter);
        this.filter.connect(this.wet);
        this.wet.connect(this.output);

        this.filter.type = 0
    	this.filter.Q.value = 1
    	this.filter.frequency.value = 1600

        var buffer = mixer.audio.context.createBuffer(1,5 * mixer.audio.context.sampleRate,mixer.audio.context.sampleRate);
        var data = buffer.getChannelData(0);
        for(var i = 0, il = data.length; i < il; i++){
        	data[i] = (Math.random() * 2) - 1;
        }

        this.noiseGen.buffer = buffer;
        this.noiseGen.loop = true;
        this.noiseGen.start(0);
	}
	Class.inherits(WhiteNoise,Effect);

	WhiteNoise.prototype.setWetLevel = function(val){
		this.wet.gain.value = val / 10;
	};

	return WhiteNoise;
});
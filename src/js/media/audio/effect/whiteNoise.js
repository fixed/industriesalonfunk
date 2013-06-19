define([
    'media/audio/effect/base'
    , 'util/class'
    , 'mixer/mixer'
],function(Effect,Class,mixer){

	function WhiteNoise(options){
		Effect.call(this,options);

        this.wet = mixer.audio.context.createGain();
        this.noiseGen = mixer.audio.context.createBufferSource();

        this.input.connect(this.output);
        this.noiseGen.connect(this.wet);
        this.wet.connect(this.output);

        var buffer = mixer.audio.context.createBuffer(1,16384,mixer.audio.context.sampleRate);
        var data = buffer.getChannelData(0);
        for(var i = 0, il = data.length; i < il; i++){
        	data[i] = Math.random();
        }

        this.noiseGen.buffer = buffer;
        this.noiseGen.loop = true;
        this.playing = false;
	}
	Class.inherits(WhiteNoise,Effect);

	WhiteNoise.prototype.setWetLevel = function(val){
		val = val / 10;
		if(val == 0 && this.playing){

			// val is 0 and we are currently playing
			// stop the loop and set the flag
			this.noiseGen.stop(0);
			this.stopped = true;

		} else if(val > 0 && !this.playing){

			// val is gt 0 and the loop isn't playing
			// start it again and set the flag
			this.stopped = false;
			this.noiseGen.start(0);
		}

		this.wet.gain.value = val;
	};

	return WhiteNoise;
});
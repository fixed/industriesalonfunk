define([
    'audio/effect/effect'
    , 'util/class'
], function(Effect,Class){

    var OldRadio = function(options){
        Effect.call(this,options);

        this.dry = audioContext.createGain();
        this.wet = audioContext.createGain();
        this.filterHigh = audioContext.createBiquadFilter();
        this.filterLow = audioContext.createBiquadFilter();
        this.filterPeak = audioContext.createBiquadFilter();
        this.compressor = audioContext.createDynamicsCompressor();

        this.input.connect(this.dry);
        this.input.connect(this.filterHigh);
        this.filterHigh.connect(this.filterLow);
        this.filterLow.connect(this.filterPeak);
        this.filterPeak.connect(this.compressor);
        this.compressor.connect(this.wet);
        this.dry.connect(this.output);
        this.wet.connect(this.output);

        this.filterHigh.type = 'highpass';
        this.filterHigh.frequency.value = 150;
        this.filterHigh.Q.value = 1;

        this.filterLow.type = 'lowpass';
        this.filterLow.frequency.value = 2000;
        this.filterLow.Q.value = 1;

        this.filterPeak.type = 'peaking';
        this.filterPeak.frequency.value = 600;
        this.filterPeak.gain.value = 4;

        this.compressor.threshold.value = -20;
        this.compressor.ratio.value = 4;
    };

    Class.inherits(OldRadio,Effect);

    OldRadio.prototype.setWetLevel = function(val){
        if(val > 1 || val < 0) throw new Error('WetLevel parameter out of range: 0 <= ' + val + ' <= 1' );
        this.dry.gain.value = 1 - val;
        this.wet.gain.value = val;
    };

    return OldRadio;
});
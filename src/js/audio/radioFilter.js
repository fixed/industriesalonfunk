define([
], function(){

    var RadioFilter = function(options){

        this._hp = options.context.createBiquadFilter();
        this._hp.type = 'highpass';
        this._hp.frequency.value = 150;
        this._hp.Q.value = 1;

        var lp = options.context.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2000;
        lp.Q.value = 1;

        var peak = options.context.createBiquadFilter();
        peak.type = 'peaking';
        peak.frequency.value = 600;
        peak.gain.value = 4;

        console.log(peak);

        this._comp = options.context.createDynamicsCompressor();
        this._comp.threshold.value = -20;
        this._comp.ratio.value = 4;

        this._hp.connect(lp);
        lp.connect(peak);
        peak.connect(this._comp);
    };

    RadioFilter.prototype.addSource = function(source){
        source.connect(this._hp);
    };

    RadioFilter.prototype.connect = function(dest){
        this._comp.connect(dest);
    };

    return RadioFilter;
});
define([
    'mixer/mixer'
],function(mixer){

    function Effect(options){
        if(options.min == undefined || options.max == undefined) throw new Error('Missing parameter for AudioEffect. Min and Max are required.');
        this.min = options.min;
        this.max = options.max;

        this.input = mixer.audio.context.createGain();
        this.output = mixer.audio.context.createGain();
    };

    Effect.prototype.connect = function(dest){
        this.output.connect(dest);
    };

    Effect.prototype.disconnect = function(){
        this.output.disconnect();
    };

    Effect.prototype.setWetLevel = function(val){
        throw(new Error('You need to implement this method in a subclass.'));
    };

    Effect.prototype.tune = function(distribution){
        var wet = this.max - distribution * (this.max - this.min);
        this.setWetLevel(wet);
    };

    return Effect;
});
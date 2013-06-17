define([
    'audio/context'
],function(Context){

    function Effect(options){
        if(!options.min || !options.max) throw new Error('Missing parameter for AudioEffect. Min and Max are required.');
        this.min = options.min;
        this.max = options.max;
    };

    Effect.prototype.connect = function(dest){
        throw(new Error('You need to implement this method in a subclass.'));
    };

    Effect.prototype.setWetLevel = function(val){
        throw(new Error('You need to implement this method in a subclass.'));
    };

    Effect.prototype.tune = function(distribution){
        var wet = this.min + distribution * (this.max - this.min);
        this.setWetLevel(wet);
    };

    return Effect;
});
define([
    'mixer/mixer'
],function(mixer){

    function Effect(options){
        this.min = options.min;
        this.max = options.max;
        
        this._effect = null;
    }

    Effect.prototype.connect = function(dest) {
        dest.setInput(this._effect);
    };

    Effect.prototype.getOutput = function() {
        return this._effect;
    };

    Effect.prototype.setInput = function(source) {
        this._effect.source = source;
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
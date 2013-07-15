define([
    'util/class',
    'mixer/mixer'
],function(Class, mixer) {

    var Sample = function(url){
        this._audio = new Audio();
        this._audio.loop = true;
        this._audio.src = url;
        this._sourceNode = mixer.audio.context.createMediaElementSource(this._audio);
    };

    Sample.prototype.play = function(){
        this._audio.play();
    };

    Sample.prototype.pause = function() {
        this._audio.pause();
    };

    Sample.prototype.connect = function(dest){
        this._sourceNode.connect(dest);
    };

    Sample.prototype.disconnect = function(){
        this._sourceNode.disconnect();
    };

    return Sample;
});
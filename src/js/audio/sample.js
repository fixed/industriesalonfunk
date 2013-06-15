define([
    'eventEmitter'
],function(EventEmiter){

    var Sample = function(options){
        this._context = options.context;
        this._dest = options.destination;
        this._loadSample(options.url);
    };

    Sample.prototype = Object.create(EventEmiter.prototype);

    Sample.prototype._loadSample = function(url){
        this._xhr = new XMLHttpRequest();
        this._xhr.open('GET',url,true);
        this._xhr.responseType = 'arraybuffer';

        this._xhr.onload = this._onLoad.bind(this);
        this._xhr.onerror = this._onLoadError.bind(this);
        this._xhr.send();
    };

    Sample.prototype._onLoad = function(){
        this._context.decodeAudioData(this._xhr.response,this._onDecode.bind(this),this._onDecodeError.bind(this));
    };

    Sample.prototype._onLoadError = function(err){
        this.trigger('error',[err]);
    };

    Sample.prototype._onDecode = function(buffer){
        if(!buffer){
            return this._onDecodeError(new Error('Could not decode requested audio file'));
        }

        this._buffer = buffer;
        //delete this._xhr;
        this.trigger('ready');
    };

    Sample.prototype._onDecodeError = function(err){
        this.trigger('error',[err]);
    };

    Sample.prototype.play = function(when,loop){
        if(this._player) return;

        this._player = this._context.createBufferSource();
        this._player.buffer = this._buffer;
        this._player.loop = loop || false;
        this._player.connect(this._dest);

        when = when || 0;
        this._player.start(when);
    };

    Sample.prototype.stop = function(when){
        if(!this._player) return;
        when = when || 0;
        this._player.stop(when);
    };

    Sample.prototype.loop = function(){
        this.play(0,true);
    };

    return Sample;
});
define([
    'eventEmitter'
    , 'audio/context'
    , 'util/class'
],function(EventEmitter,Context,Class){

    var Sample = function(url){
        EventEmitter.call(this);
        this._loadSample(url);
        this._destinations = [];
    };

    Class.inherits(Sample,EventEmitter);

    Sample.prototype._loadSample = function(url){
        this._xhr = new XMLHttpRequest();
        this._xhr.open('GET',url,true);
        this._xhr.responseType = 'arraybuffer';

        this._xhr.onload = this._onLoad.bind(this);
        this._xhr.onerror = this._onLoadError.bind(this);
        this._xhr.send();
    };

    Sample.prototype._onLoad = function(){
        Context.decodeAudioData(this._xhr.response,this._onDecode.bind(this),this._onDecodeError.bind(this));
    };

    Sample.prototype._onLoadError = function(err){
        this.trigger('error',[err]);
    };

    Sample.prototype._onDecode = function(buffer){
        if(!buffer){
            return this._onDecodeError(new Error('Could not decode requested audio file'));
        }

        this._buffer = buffer;
        delete this._xhr;
        this.loop();
    };

    Sample.prototype._onDecodeError = function(err){
        this.trigger('error',[err]);
    };

    Sample.prototype.play = function(when,loop){
        if(this._player) return;

        this._player = Context.createBufferSource();
        this._player.buffer = this._buffer;
        this._player.loop = loop || false;
        if(this._destinations){
            this._destinations.forEach(function(dest){
                this._player.connect(dest);
            },this);
        }
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

    Sample.prototype.connect = function(dest){
        this._destinations.push(dest);
        if(this._player) this._player.connect(dest);
    };

    Sample.prototype.disconnect = function(){
        this._destinations = [];
        if(this._player) this._player.disconnect();
    };

    return Sample;
});
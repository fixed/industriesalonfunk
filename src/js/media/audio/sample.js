define([
    'eventEmitter',
    'util/class',
    'mixer/mixer'
],function(EventEmitter, Class, mixer) {

    var Sample = function(url){
        EventEmitter.call(this);
        this._loadSample(url);
        this._destinations = [];
        this._playStart = 0;
        this._offset = 0;
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
        mixer.audio.context.decodeAudioData(this._xhr.response,this._onDecode.bind(this),this._onDecodeError.bind(this));
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
    };

    Sample.prototype._onDecodeError = function(err){
        this.trigger('error',[err]);
    };

    Sample.prototype.play = function(when,loop){
        // are we playing already and do we already have a buffer?
        if(this._player || !this._buffer) return;

        // create a new player
        this._player = mixer.audio.context.createBufferSource();
        this._player.buffer = this._buffer;
        this._player.loop = true;

        // connect destinations
        if (this._destinations.length > 0) {
            this._destinations.forEach(function(dest) {
                this._player.connect(dest);
            }, this);
        }

        // Get current AudioContext time and check when param
        var now = mixer.audio.context.currentTime;
        when = when || 0; 

        // Save starting time for use in pause
        this._playStart = now + when;
        this._player.start(when,this._offset);
    };

    Sample.prototype.pause = function(when) {
        // are we playing?
        if(!this._player) return;
        
        // Get current AudioContext time and check when param
        when = when || 0;
        var now = mixer.audio.context.currentTime;

        // Store offset for later use in play
        this._offset = ((now - this._playStart) % this._buffer.duration) + this._offset;

        // stop the player and delete the reference
        this._player.stop(now + when);
        delete this._player;
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
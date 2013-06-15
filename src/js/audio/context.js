define([
], function(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    return new AudioContext();
});
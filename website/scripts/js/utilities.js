function timeFromMillis(millis) {
    
    var milliseconds = parseInt((millis % 1000) / 100);
    var seconds = parseInt((millis / 1000) % 60);
    var minutes = parseInt((millis / (1000 * 60)) % 60);
    
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    
    return minutes + ':' + seconds + '.' + milliseconds;
    
}

var randomSeed = 1;

function random() {
    var randomValue = Math.sin(randomSeed++) * 10000;
    return randomValue - Math.floor(randomValue);
}
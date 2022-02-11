exports.logBarStart = function(bar1, start){
    // start the progress bar with a total value of 200 and start value of 0
    bar1.start(start, 0);
}

exports.logBar = function(bar1){
    // update the current value in your application..
    bar1.increment(1);
}

exports.logBarStop = function(bar1){
    // stop the progress bar
    bar1.stop();
}

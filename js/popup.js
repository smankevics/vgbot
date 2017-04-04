(function() {
    function start() {
        chrome.extension.getBackgroundPage().Bot.start();
        document.getElementById('btn_start').disabled = true;
        document.getElementById('btn_stop').disabled = false;
        document.getElementById('status').innerHTML = 'Started';
    }
    function stop() {
        chrome.extension.getBackgroundPage().Bot.stop();
        document.getElementById('btn_start').disabled = false;
        document.getElementById('btn_stop').disabled = true;
        document.getElementById('status').innerHTML = 'Stopped';
    }

    window.onload = function() {
        let isStarted = chrome.extension.getBackgroundPage().Bot.isStarted();
        
        document.getElementById('status').innerHTML = isStarted ? 'Started' : 'Stopped';
        document.getElementById('btn_start').onclick = start;
        document.getElementById('btn_stop').onclick = stop;

        document.getElementById('btn_start').disabled = isStarted;
        document.getElementById('btn_stop').disabled = !isStarted;
    }
})();
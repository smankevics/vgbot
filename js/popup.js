(function() {
    function start() {
        chrome.extension.getBackgroundPage().Bot.start();
        document.getElementById('btn_start').disabled = true;
        document.getElementById('btn_stop').disabled = false;
    }
    function stop() {
        chrome.extension.getBackgroundPage().Bot.stop();
        document.getElementById('btn_start').disabled = false;
        document.getElementById('btn_stop').disabled = true;
    }

    window.onload = function() {
        document.getElementById('btn_start').onclick = start;
        document.getElementById('btn_stop').onclick = stop;

        let isStarted = chrome.extension.getBackgroundPage().Bot.isStarted();
        document.getElementById('btn_start').disabled = isStarted;
        document.getElementById('btn_stop').disabled = !isStarted;
    }
})();
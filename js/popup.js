(function() {
    function start() {
        saveSettings();
        document.getElementById('btn_start').disabled = true;
        document.getElementById('btn_stop').disabled = false;
        document.getElementById('status').innerHTML = 'Started';
        
        chrome.extension.getBackgroundPage().Bot.start(getSettings());
    }
    function stop() {
        chrome.extension.getBackgroundPage().Bot.stop();
        document.getElementById('btn_start').disabled = false;
        document.getElementById('btn_stop').disabled = true;
        document.getElementById('status').innerHTML = 'Stopped';
    }

    function getSettings() {
        return {
            autoNavigate: document.getElementById('autoNavigate').checked
        }
    }

    function saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(getSettings()));
    }

    window.onload = function() {
        let isStarted = chrome.extension.getBackgroundPage().Bot.isStarted();
        
        document.getElementById('status').innerHTML = isStarted ? 'Started' : 'Stopped';
        document.getElementById('btn_start').onclick = start;
        document.getElementById('btn_stop').onclick = stop;

        document.getElementById('btn_start').disabled = isStarted;
        document.getElementById('btn_stop').disabled = !isStarted;

        //load settings
        var settings = localStorage.getItem('userSettings');
        if(settings) {
            settings = JSON.parse(settings);
            document.getElementById('autoNavigate').checked = settings.autoNavigate;
        }

    }
})();
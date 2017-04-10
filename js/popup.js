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
            playerClass: document.getElementById('playerClass').value,
            autoNavigate: document.getElementById('autoNavigate').checked,
            pickUpItems: document.getElementById('pickUpItems').checked,
            autoHeal: document.getElementById('autoHeal').checked,
            autoEquipWeapon: document.getElementById('autoEquipWeapon').checked,
            weaponsList: document.getElementById('weaponsList').value.split(','),
            autoHealValue: document.getElementById('autoHealValue').value
        }
    }

    function saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(getSettings()));
    }

    function handleHealValueChange(e) {
        if (isNaN(parseFloat(e.target.value)) || !isFinite(e.target.value)) e.target.value = 0;
        if (e.target.value < 0) e.target.value = 0;
        if (e.target.value > 100) e.target.value = 100;
    }

    window.onload = function() {
        let isStarted = chrome.extension.getBackgroundPage().Bot.isStarted();
        
        document.getElementById('status').innerHTML = isStarted ? 'Started' : 'Stopped';
        document.getElementById('btn_start').onclick = start;
        document.getElementById('btn_stop').onclick = stop;
        document.getElementById('btn_save').onclick = saveSettings;
        document.getElementById('autoHealValue').onchange = handleHealValueChange;

        document.getElementById('btn_start').disabled = isStarted;
        document.getElementById('btn_stop').disabled = !isStarted;

        //load settings
        var settings = localStorage.getItem('userSettings');
        if(settings) {
            settings = JSON.parse(settings);
            document.getElementById('playerClass').value = settings.playerClass;
            document.getElementById('autoNavigate').checked = settings.autoNavigate;
            document.getElementById('pickUpItems').checked = settings.pickUpItems;
            document.getElementById('autoHeal').checked = settings.autoHeal;
            document.getElementById('autoEquipWeapon').checked = settings.autoEquipWeapon;
            document.getElementById('weaponsList').value = settings.weaponsList.join();
            document.getElementById('autoHealValue').value = settings.autoHealValue || 50;
        }

    }
})();
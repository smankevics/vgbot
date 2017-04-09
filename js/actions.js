var Actions = (() => {
    function execute(tabId, f, code) {
        if(!tabId) 
            return;

        chrome.tabs.executeScript(tabId, { code: '(' + f + ')' + code })
    }

    return {
        up: (tabId) => execute(tabId, Utils.getLinkByHref, '("do=nord")[0].click()'),
        down: (tabId) => execute(tabId, Utils.getLinkByHref, '("do=zuid")[0].click()'),
        left: (tabId) => execute(tabId, Utils.getLinkByHref, '("do=west")[0].click()'),
        right: (tabId) => execute(tabId, Utils.getLinkByHref, '("do=ost")[0].click()'),
        itemsOnTheGround: (tabId) => execute(tabId, Utils.getLinkByText, '("Вещи под ногами")[0].click()'),
        pickAllItems: (tabId) => execute(tabId, Utils.getLinkByText, '("Забрать всё")[0].click()'),
        returnToDefault: (tabId) => execute(tabId, Utils.getLinkByText, '("На главную")[0].click()'),

        //combat
        selectEnemy: (tabId) => execute(tabId, Utils.getLinkByHref, '("do=boi")[0].click()'),
        autoHitCheckbox: (tabId) => execute(tabId, Utils.getInputByName, '("voi")[0].checked = true'),
        hitEnemy: (tabId) => execute(tabId, Utils.getButtonByName, '("удaрить")[0].click()'),
        changeWeapon: (tabId) => execute(tabId, Utils.getButtonByName, '("сменить оружие")[0].click()'),
        combatEndTurn: (tabId) => execute(tabId, Utils.getButtonByName, '("конец хода")[0].click()'),

        useHpPotion: (tabId) => execute(tabId, Utils.getLinkByText, '("+")[0].click()'),
        useEquipment: (tabId, idm) => execute(tabId, Utils.getLinkByHref, '("idm=' + idm + '")[0].click()'),

        refresh: (tabId) => execute(tabId, Utils.getLinkByText, '("Обновить")[0].click()')
    }
})()
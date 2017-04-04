var Actions = {
    up: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByHref + ')("do=nord")[0].click()'
        })
    },
    down: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByHref + ')("do=zuid")[0].click()'
        })
    },
    left: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByHref + ')("do=west")[0].click()'
        })
    },
    right: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByHref + ')("do=ost")[0].click()'
        })
    },
    itemsOnTheGround: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByText + ')("Вещи под ногами")[0].click()'
        })
    },
    pickAllItems: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByText + ')("Забрать всё")[0].click()'
        })
    },
    returnToDefault: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByText + ')("На главную")[0].click()'
        })
    },

    //combat
    selectEnemy: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByHref + ')("do=boi")[0].click()'
        })
    },
    hitEnemy: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getInputByName + ')("voi")[0].checked = true'
        })
        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getButtonByName + ')("удaрить")[0].click()'
        })
    },
    combatEndTurn: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getButtonByName + ')("конец хода")[0].click()'
        })
    },

    
    useHpPotion: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByText + ')("+")[0].click()'
        })
    },

    refresh: (tabId) => {
        if(!tabId)
            return;

        chrome.tabs.executeScript(tabId, {
            code: '(' + Utils.getLinkByText + ')("Обновить")[0].click()'
        })
    }
}
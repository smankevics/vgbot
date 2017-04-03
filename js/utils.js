var Utils = {
    states: {
        DEFAULT: 'State.DEFAULT',
        DEFAULT_ITEMS: 'State.DEFAULT_ITEMS',
        ITEMS_ON_THE_GROUND: 'State.ITEMS_ON_THE_GROUND',
        COMBAT_SELECT_ENEMY: 'State.COMBAT_SELECT_ENEMY',
        COMBAT_SELECT_ACTION: 'State.COMBAT_SELECT_ACTION'
    },
    getButtonByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.value.indexOf(name) > -1),
    getCurrentState: (cb) => {
        Utils.getPageContent((content) => {'<a href="main.php?blok=infov'
            let state = 'NONE';

            if(content.indexOf('do=nord') > -1 && content.indexOf('Вещи под ногами') > -1) {
                state = Utils.states.DEFAULT_ITEMS;
            } else if(content.indexOf('do=nord') > -1) {
                state = Utils.states.DEFAULT;
            } else if(content.indexOf('Вещи под ногами') > -1 && content.indexOf('Забрать всё') > -1 && content.indexOf('inf') > -1) {
                state = Utils.states.ITEMS_ON_THE_GROUND;
            } else if(content.indexOf('<a href="main.php?blok=fight&amp;do=boi') > -1) {
                state = Utils.states.COMBAT_SELECT_ENEMY;
            } else if(content.indexOf('<form action="main.php?blok=fight&amp;do=boi') > -1) {
                state = Utils.states.COMBAT_SELECT_ACTION;
            }

            cb(state);
        })
    },
    getLinkByHref: (name) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.href.indexOf(name) > -1),
    getLinkByText: (value) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.text.indexOf(value) > -1),
    getPageContent: (cb) => {
        chrome.tabs.executeScript({
            code: 'document.body.innerHTML'
        }, (result) => {
            cb(result[0]);
        })
    },
    getSelectedTab: (cb) => {
        chrome.tabs.getSelected(null, cb);
    },
    rnd: (min, max) => Math.floor((Math.random() * max) + min)
}
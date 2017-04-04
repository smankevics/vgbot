var Utils = {
    getButtonByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.value.indexOf(name) > -1),
    getInputByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.name.indexOf(name) > -1),
    getCurrentState: (tabId, cb) => {
        Utils.getPageContent(tabId, (content) => {
            let state = 'NONE',
                lowHp = false;
            
            if (content.indexOf('do=nord') > -1 && content.indexOf('Вещи под ногами') > -1) {
                state = Defines.states.DEFAULT_ITEMS;
            } else if (content.indexOf('do=nord') > -1) {
                state = Defines.states.DEFAULT;
            } else if (content.indexOf('Вещи под ногами') > -1 && content.indexOf('Забрать всё') > -1 && content.indexOf('inf') > -1) {
                state = Defines.states.ITEMS_ON_THE_GROUND;
            } else if (content.indexOf('<a href="main.php?blok=fight&amp;do=boi') > -1) {
                state = Defines.states.COMBAT_SELECT_ENEMY;
            } else if (content.indexOf('<form action="main.php?blok=fight&amp;do=boi') > -1) {
                let persons = Utils.getPersons(content);

                //do not move if hp less than 10%
                if(persons[0].hp / persons[0].hpMax < 0.2)
                    lowHp = true;

                if(persons[0].moves > 2)
                    state = Defines.states.COMBAT_SELECT_ACTION;
                else
                    state = Defines.states.COMBAT_END_TURN;
            }

            cb(state, lowHp);
        })
    },
    getLinkByHref: (name) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.href.indexOf(name) > -1),
    getLinkByText: (value) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.text.indexOf(value) > -1),
    getPageContent: (tabId, cb) => {
        chrome.tabs.executeScript(tabId, {
            code: 'document.body.innerHTML'
        }, (result) => {
            cb(result[0]);
        })
    },
    getSelectedTab: (cb) => {
        chrome.tabs.getSelected(null, cb);
    },
    getPersons: (content) => {
        return content
            .split('<')
            .map((s) => s.substring(s.indexOf('>') + 1))
            .filter((s) => s.match(/\S+[0-9]+\/[0-9]+/g))
            .map((s) => {
                let name = s.split('.')[0];
                name = name.substring(0, name.lastIndexOf(' '));
                let result = {
                    name: name
                }

                s.replace(name + ' ', '')
                    .split(' ')
                    .forEach((s) => {
                        let items = s.split('.'),
                            name = items[0],
                            values = items[1].split('/'),
                            val = Number(values[0]),
                            max = Number(values[1]);

                        result[Defines.propsMap[name]] = val;
                        if (max >= 0)
                            result[Defines.propsMap[name] + 'Max'] = max;
                    });

                return result;
            });
    },
    rnd: (min, max) => Math.floor((Math.random() * max) + min)
}
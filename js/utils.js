var Utils = (() => {
    let getCurrentState = (tabId, cb) => {
        Utils.getPageContent(tabId, (content) => {
            let state = 'NONE';

            if (content.indexOf('do=nord') > -1 && content.indexOf('do=zuid' > -1)) {
                state = Defines.states.DEFAULT;
            } else if (content.indexOf('Вещи под ногами') > -1 && content.indexOf('Забрать всё') > -1) {
                state = Defines.states.ITEMS_ON_THE_GROUND;
            } else if (content.indexOf('<a href="main.php?blok=fight&amp;do=boi') > -1) {
                state = Defines.states.SELECT_ENEMY;
            } else if (content.indexOf('<form action="main.php?blok=fight&amp;do=boi') > -1) {
                state = Defines.states.COMBAT;
            }

            cb(state, content);
        })
    };
    let getPageContent = (tabId, cb) => {
        chrome.tabs.executeScript(tabId, {
            code: 'document.body.innerHTML'
        }, (result) => {
            cb(result[0]);
        })
    };
    let getPersons = (content) => {
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
    };
    let getPlayerData = (body) => {
        let result = body
            .split('<')
            .map((s) => s.substring(s.indexOf('>') + 1))
            .filter((s) => s);

        result = result
            .slice(result.indexOf('Герой') + 1)
            .filter((s) => s !== ' [' && s !== ' ' && s !== '] ' && s !== ']' && s !== '+');

        return {
            name: result[0].substring(1),
            level: Number(result[1].split(' ')[1]),
            rating: Number(result[1].split(' ')[3]),
            hp: Number(result[2].split('/')[0]),
            hpMax: Number(result[2].split('/')[1]),
            mp: Number(result[3].split('/')[0]),
            mpMax: Number(result[3].split('/')[1]),
            money: Number(result[4].split(' ')[1]),
            posX: Number(result[6].split('/')[0]),
            posY: Number(result[6].split('/')[1]),
            location: result[7].split(' ')[1]
        }
    }

    return {
        getButtonByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.value.indexOf(name) > -1),
        getInputByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.name.indexOf(name) > -1),
        getLinkByHref: (name) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.href.indexOf(name) > -1),
        getLinkByText: (value) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.text.indexOf(value) > -1),
        getSelectedTab: (cb) => chrome.tabs.getSelected(null, cb),
        rnd: (min, max) => Math.floor((Math.random() * max) + min),
        getCurrentState: getCurrentState,
        getPlayerData: getPlayerData,
        getPersons: getPersons,
        getPageContent: getPageContent
    }
})()
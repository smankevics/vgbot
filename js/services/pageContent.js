var PageContent = (() => {
  let pageHtml = '';
  let pageText = '';

  let getCurrentState = () => {
    let state = Defines.states.NONE;

    if (pageHtml.indexOf('do=nord') > -1 && pageHtml.indexOf('do=zuid' > -1)) {
      state = Defines.states.DEFAULT;
    } else if (pageHtml.indexOf('Вещи под ногами') > -1 && pageHtml.indexOf('Забрать всё') > -1) {
      state = Defines.states.ITEMS_ON_THE_GROUND;
    } else if (pageHtml.indexOf('<a href="main.php?blok=fight&amp;do=boi') > -1) {
      state = Defines.states.SELECT_ENEMY;
    } else if (pageHtml.indexOf('<form action="main.php?blok=fight&amp;do=boi') > -1) {
      state = Defines.states.COMBAT;
    } else if (pageHtml.indexOf('main.php?blok=restart') > -1) {
      state = Defines.states.DEATH;
    }

    return state;
  };

  let refresh = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.executeScript(Bot.currentTabId(), {
          code: '(() => ({pageHtml: document.body.innerHTML, pageText: document.body.innerText}))()'
      }, (result) => {
        if(result[0]) {
          pageHtml = result[0].pageHtml;
          pageText = result[0].pageText;
          resolve(getCurrentState());
        } else {
          reject(new Error('Failed to get page content'));
        }
      })
    });
  };

  let getPlayerData = () => {
    let res = {};
    pageText.split('\n').forEach((s) => {
      if (s.indexOf('Герой ') === 0) {
        res.name = s.split(' ')[1];
      } else if (s.indexOf('Уровень ') === 0) {
        res.level = Number(s.split(' ')[1]);
        res.rating = Number(s.split(' ')[3]);
      } else if (s.indexOf(' [+] ') > -1) {
        let hp = s.split(' ')[0];
        let mp = s.split(' ')[2];
        res.hp = Number(hp.split('/')[0]);
        res.hpMax = Number(hp.split('/')[1]);
        res.mp = Number(mp.split('/')[0]);
        res.mpMax = Number(mp.split('/')[1]);
      } else if (s.indexOf('Лошадь') === 0 || s.indexOf('Кошка') === 0 || s.indexOf('Филин') === 0) {
        res.pet = {
          type: s.split(' ')[0],
          name: s.split(' ')[1],
          satiety: Number(s.split(' ')[2].split('/')[0]),
          satietyMax: Number(s.split(' ')[2].split('/')[1])
        }
      } else if (s.indexOf('Монеты: ') === 0) {
        res.money = Number(s.split(' ')[1]);
      } else if (s.indexOf('Координата ') === 0) {
        res.posY = Number(s.split(' ')[1].split('/')[0]);
        res.posX = Number(s.split(' ')[1].split('/')[1]);
      } else if (s.indexOf('Местность: ') === 0) {
        res.location = s.split(' ')[1];
      }
    });

    return res;
  }

  let getPersons = () => {
    return pageHtml
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

  return {
    refresh: refresh,
    getHtml: () => pageHtml,
    getText: () => pageText,
    
    getCurrentState: getCurrentState,
    getPlayerData: getPlayerData,
    getPersons: getPersons
  }
})();
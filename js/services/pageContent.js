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

  let getFighterData = (s) => {
    let data = {};
    s.replace('Цель: ', '').split(' ').forEach((val, i) => {
      if(i === 0) {
        data.name = val;
      } else if (val.indexOf('дист.') === 0) {
        data.distance = Number(val.split('.')[1]);
      } else if (val.indexOf('ож.') === 0) {
        data.hp = Number(val.split('.')[1].split('/')[0]);
        data.hpMax = Number(val.split('.')[1].split('/')[1]);
      } else if (val.indexOf('ом.') === 0) {
        data.mp = Number(val.split('.')[1].split('/')[0]);
        data.mpMax = Number(val.split('.')[1].split('/')[1]);
      } else if (val.indexOf('яр.') === 0) {
        data.fury = Number(val.split('.')[1].split('/')[0]);
        data.furyMax = Number(val.split('.')[1].split('/')[1]);
      } else if (val.indexOf('од.') === 0) {
        data.moves = Number(val.split('.')[1].split('/')[0]);
        data.movesMax = Number(val.split('.')[1].split('/')[1]);
      }
    });
    return data;
  }
  
  let getRoundData = () => {
    let infoLineIndex = 0;
    let result = pageText.split('\n').filter((s) => s);

    result.forEach((s, i) => {
      if(s.indexOf('Идёт бой! ') === 0)
        infoLineIndex = i;
    });

    let posLine = result.filter((s) => s[0] ===  '[' && s[s.length-1] === ']')[0];
    let playerPos = posLine.indexOf('*');
    let enemyPos = posLine.indexOf('#') > -1 ? posLine.indexOf('#') : playerPos;
    let res = {
      round: Number(result[infoLineIndex].split(' ')[3]),
      player: getFighterData(result[infoLineIndex+1]),
      enemy: getFighterData(result[infoLineIndex+2]),
      playerPos: playerPos,
      enemyPos: enemyPos
    }
    return res;
  };

  return {
    refresh: refresh,
    getHtml: () => pageHtml,
    getText: () => pageText,
    
    getCurrentState: getCurrentState,
    getPlayerData: getPlayerData,
    getRoundData: getRoundData
  }
})();
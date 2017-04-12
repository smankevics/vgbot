var MainScene = (tabId, settings) => {
  let state = 0;
  let canShowNotification = true;

  let ckeckIncomingMessages = (cb) => {
    state++;

    if(PageContent.getText().indexOf('Новая почта!') > -1 && canShowNotification) {
      Actions.notificate(tabId, 'New message!');
      setTimeout(() => canShowNotification = true, 30000);
      canShowNotification = false;
    } 

    return states[state](cb);
  }

  let pickItems = (cb) => {
    state++;
    if(PageContent.getHtml().indexOf('Вещи под ногами') > -1 && settings.pickUpItems) {
      Actions.itemsOnTheGround(tabId);
      cb(Defines.stepResults.OK);
    } else {
      states[state](cb);
    }
  }

  let heal = (cb) => {
    state++;

    if(!settings.autoHeal)
      return states[state](cb);
      
    let player = PageContent.getPlayerData();

    if(player.hp / player.hpMax < settings.autoHealValue / 100) {
      Actions.useHpPotion(tabId);
      cb(Defines.stepResults.OK);
    } else {
      states[state](cb);
    }
  }

  let restore = (cb) => {
    state++;

    if(!settings.autoRestore)
      return states[state](cb);
      
    let player = PageContent.getPlayerData();

    if(player.mp / player.mpMax < settings.autoRestoreValue / 100) {
      Actions.useMpPotion(tabId);
      cb(Defines.stepResults.OK);
    } else {
      states[state](cb);
    }
  }

  let checkAutoStop = (cb) => {
    state++;
    let player = PageContent.getPlayerData();

    if(settings.lowHp) {
      if(player.hp / player.hpMax < settings.lowHpValue / 100) {
        return cb(Defines.stepResults.STOP);
      }
    }

    if(settings.lowMp) {
      if(player.mp / player.mpMax < settings.lowMpValue / 100) {
        return cb(Defines.stepResults.STOP);
      } else {
        return states[state](cb);
      }
    } else {
      return states[state](cb);
    }
  }

  let checkWeapon = (cb) => {
    state++;

    if(!settings.autoEquipWeapon)
      return states[state](cb);
    let that = this;

    Utils.checkWeapon(PageContent.getHtml(), () => {
      Utils.equipWeapon(PageContent.getHtml(), () => {
        return states[state](cb);
      });
    }, () => {
      return states[state](cb);
    });
  }

  let nextMoveUp = false;
  let navigate = (cb) => {
    state = 0;
    if(!settings.autoNavigate)
      return cb(Defines.stepResults.NO_ACTION);

    if(nextMoveUp)
        Actions.up(tabId);
    else
        Actions.down(tabId);

    cb(Defines.stepResults.OK);
    nextMoveUp = !nextMoveUp;
  }

  const states = [
    ckeckIncomingMessages,
    pickItems,
    heal,
    restore,
    checkAutoStop,
    checkWeapon,
    navigate
  ]

  return {
    process: (cb) => {
      states[state](cb);
    }
  }
};
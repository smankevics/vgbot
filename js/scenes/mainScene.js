var MainScene = (tabId, settings) => {
  let state = 0;

  let pickItems = () => {
    state++;
    if(PageContent.getHtml().indexOf('Вещи под ногами') > -1 && settings.pickUpItems) {
      Actions.itemsOnTheGround(tabId);
    } else {
      return states[state]();
    }
  }

  let usePotion = () => {
    state++;

    if(!settings.autoHeal)
      return states[state]();
      
    let player = PageContent.getPlayerData();

    if(player.hp / player.hpMax < settings.autoHealValue / 100) {
      Actions.useHpPotion(tabId);
    } else {
      return states[state]();
    }
  }

  let checkWeapon = () => {
    state++;

    if(!settings.autoEquipWeapon)
      return states[state]();

    Utils.checkWeapon(PageContent.getHtml(), () => {
      Utils.equipWeapon(PageContent.getHtml(), () => {
        return states[state]();
      });
    }, () => {
      return states[state]();
    });
  }

  let nextMoveUp = false;
  let navigate = () => {
    state = 0;
    if(!settings.autoNavigate)
      return true;

    if(nextMoveUp)
        Actions.up(tabId);
    else
        Actions.down(tabId);

    nextMoveUp = !nextMoveUp;
  }

  const states = [
    pickItems,
    usePotion,
    checkWeapon,
    navigate
  ]

  return {
    process: () => {
      states[state]();
    }
  }
};
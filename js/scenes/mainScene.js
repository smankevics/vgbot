var MainScene = (tabId, settings) => {
  let state = 0;

  let pickItems = (body) => {
    state++;
    if(body.indexOf('Вещи под ногами') > -1 && settings.pickUpItems) {
      Actions.itemsOnTheGround(tabId);
    } else {
      return states[state](body);
    }
  }

  let usePotion = (body) => {
    state++;
    let player = Utils.getPlayerData(body);

    if(player.hp / player.hpMax < 0.2) {
      Actions.useHpPotion(tabId);
    } else {
      return states[state](body);
    }
  }

  let checkWeapon = (body) => {
    state++;

    Utils.checkWeapon(body, () => {
      Utils.equipWeapon(body, () => {
        return states[state](body);
      });
    }, () => {
      return states[state](body);
    });
  }

  let nextMoveUp = false;
  let navigate = (body) => {
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
    process: (body) => {
      states[state](body);
    }
  }
};
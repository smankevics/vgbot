var MainScene = (tabId) => {
  let state = 0;

  let pickItems = (body) => {
    state++;
    if(body.indexOf('Вещи под ногами') > -1) {
      Actions.itemsOnTheGround(tabId);
    } else {
      states[state](body);
    }
  }

  let usePotion = (body) => {
    state++;
    let player = Utils.getPlayerData(body);

    if(player.hp / player.hpMax < 0.2) {
      Actions.useHpPotion(tabId);
    } else {
      states[state](body);
    }
  }

  let nextMoveUp = false;
  let navigate = (body) => {
    state = 0;
    if(nextMoveUp)
        Actions.up(tabId);
    else
        Actions.down(tabId);

    nextMoveUp = !nextMoveUp;
  }

  const states = [
    pickItems,
    usePotion,
    navigate
  ]

  return {
    process: (body) => {
      states[state](body);
    }
  }
};
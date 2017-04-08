var FightScene = (tabId) => {
  let state = 0;

  let checkAutoHit = (body) => {
    state++;
    Actions.autoHitCheckbox(tabId);
    states[state](body);
  }

  let hit = (body) => {
    state++;
    Actions.hitEnemy(tabId);
  }

  let checkEndTurnButton = (body) => {
    state++;

    if(body.indexOf('>конец хода<') > -1)
      states[state](body);
    else
      Actions.refresh(tabId);
  }

  let endTurn = (body) => {
    state = 0;
    Actions.combatEndTurn(tabId);
  }

  const states = [
    checkAutoHit,
    hit,
    checkEndTurnButton,
    endTurn
  ]

  return {
    process: (body) => {
      states[state](body);
    }
  }
};
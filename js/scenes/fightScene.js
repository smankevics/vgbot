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

  let endTurn = (body) => {
    state = 0;
    Actions.combatEndTurn(tabId);
  }

  const states = [
    checkAutoHit,
    hit,
    endTurn
  ]

  return {
    process: (body) => {
      states[state](body);
    }
  }
};
var FightScene = (tabId) => {
  let state = 0;

  let checkAutoHit = () => {
    state++;
    Actions.autoHitCheckbox(tabId);
    states[state]();
  }

  let hit = () => {
    state++;
    Actions.hitEnemy(tabId);
  }

  let checkEndTurnButton = () => {
    state++;

    if(PageContent.getHtml().indexOf('"конец хода"') > -1)
      states[state]();
    else
      Actions.refresh(tabId);
  }

  let endTurn = () => {
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
    process: () => {
      if(state > 0) {
        let d = PageContent.getRoundData();
        if(d && d.player && d.player.moves > 2)
          state = 0;
      }
      states[state]();
    }
  }
};
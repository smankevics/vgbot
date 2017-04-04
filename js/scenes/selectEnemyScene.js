var SelectEnemyScene = (tabId) => {
  let state = 0;

  let selectFirstEnemy = (body) => {
    state = 0;
    Actions.selectEnemy(tabId);
  }

  const states = [
    selectFirstEnemy
  ]

  return {
    process: (body) => {
      states[state](body);
    }
  }
};
var SelectEnemyScene = (tabId) => {
  let state = 0;

  let selectFirstEnemy = () => {
    state = 0;
    Actions.selectEnemy(tabId);
  }

  const states = [
    selectFirstEnemy
  ]

  return {
    process: () => {
      states[state]();
    }
  }
};
var SelectEnemyScene = (tabId) => {
  let state = 0;

  let selectFirstEnemy = (cb) => {
    state = 0;
    Actions.selectEnemy(tabId);
    cb(Defines.stepResults.OK);
  }

  const states = [
    selectFirstEnemy
  ]

  return {
    process: (cb) => {
      states[state](cb);
    }
  }
};
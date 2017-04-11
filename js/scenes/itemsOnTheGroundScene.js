var ItemsOnTheGroundScene = (tabId) => {
  let state = 0;

  let pickAllItems = (cb) => {
    state = 0;
    Actions.pickAllItems(tabId);
    cb(Defines.stepResults.OK);
  }

  const states = [
    pickAllItems
  ]

  return {
    process: (cb) => {
      states[state](cb);
    }
  }
};
var ItemsOnTheGroundScene = (tabId) => {
  let state = 0;

  let pickAllItems = () => {
    state = 0;
    Actions.pickAllItems(tabId);
  }

  const states = [
    pickAllItems
  ]

  return {
    process: () => {
      states[state]();
    }
  }
};
var ItemsOnTheGroundScene = (tabId) => {
  let state = 0;

  let pickAllItems = (body) => {
    state = 0;
    Actions.pickAllItems(tabId);
  }

  const states = [
    pickAllItems
  ]

  return {
    process: (body) => {
      states[state](body);
    }
  }
};
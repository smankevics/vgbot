var Bot = (() => {
  const minDelay = 600;
  const maxDelay = 2000;

  let processTimeout;
  let nextMoveUp = false;
  let tabId;
  let started = false;
  let lowHp = false;

  //scenes
  let mainScene;
  let itemsOnTheGroundScene;
  let selectEnemyScene;
  let fightScene;

  let settings = {};

  let start = (_settings) => {
    settings = _settings;
    chrome.tabs.getSelected(null, (tab) => {
      tabId = tab.id;

      //create scenes
      mainScene = MainScene(tabId, settings);
      itemsOnTheGroundScene = ItemsOnTheGroundScene(tabId, settings);
      selectEnemyScene = SelectEnemyScene(tabId, settings);
      fightScene = FightScene(tabId, settings);

      attachListener();
      started = true;
      lowHp = false;
      process();
    });
  }

  let stop = () => {
    removeListener();

    if (processTimeout)
      clearTimeout(processTimeout);

    nextMoveUp = false;
    started = false;
    lowHp = false;
  }

  let process = () => {
    let noAction = false;
    PageContent.refresh()
      .then((state) => {
        if (state === Defines.states.DEFAULT) {
          noAction = mainScene.process();
        } else if (state === Defines.states.ITEMS_ON_THE_GROUND) {
          noAction = itemsOnTheGroundScene.process();
        } else if (state === Defines.states.SELECT_ENEMY) {
          noAction = selectEnemyScene.process();
        } else if (state === Defines.states.COMBAT) {
          noAction = fightScene.process();
        } else if (state === Defines.states.NONE) {
          Actions.refresh(tabId);
        } else if (state === Defines.states.DEATH) {
          //stop the process
          stop();
        }

        if (noAction)
          processTimeout = setTimeout(process, Utils.rnd(minDelay, maxDelay));
      });
  }

  let pageRefreshHandler = (_tabId, _changeInfo, _tab) => {
    if (_tabId === tabId && started && _changeInfo.status === 'complete') {
      if (processTimeout)
        clearTimeout(processTimeout);

      processTimeout = setTimeout(process, Utils.rnd(minDelay, maxDelay));
    }
  };

  let attachListener = () => chrome.tabs.onUpdated.addListener(pageRefreshHandler);
  let removeListener = () => chrome.tabs.onUpdated.removeListener(pageRefreshHandler);
  let isStarted = () => started;
  let currentTabId = () => tabId;

  return {
    start: start,
    stop: stop,
    isStarted: isStarted,

    currentTabId: currentTabId
  }
})();
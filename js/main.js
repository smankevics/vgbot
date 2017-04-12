var Bot = (() => {
  const minDelay = 300;
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
      
      Actions.checkNotificationPermissions(tabId);

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

  let handleSceneResult = (result) => {
    if (result === Defines.stepResults.NO_ACTION) {
      processTimeout = setTimeout(process, Utils.rnd(minDelay, maxDelay));
    } else if (result === Defines.stepResults.STOP) {
      stop();
    }
  }

  let process = () => {
    let result, scene;
    PageContent.refresh()
      .then((state) => {
        if (state === Defines.states.DEFAULT) {
          scene = mainScene;
        } else if (state === Defines.states.ITEMS_ON_THE_GROUND) {
          scene = itemsOnTheGroundScene;
        } else if (state === Defines.states.SELECT_ENEMY) {
          scene = selectEnemyScene;
        } else if (state === Defines.states.COMBAT) {
          scene = fightScene;
        } else if (state === Defines.states.NONE) {
          Actions.refresh(tabId);
          result = Defines.stepResults.OK;
        } else if (state === Defines.states.DEATH) {
          result = Defines.stepResults.STOP;
        }

        if (scene) {
          scene.process((_result) => {
            handleSceneResult(_result);
          })
        } else {
          handleSceneResult(result);
        }

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
  let getSettings = () => settings;

  return {
    start: start,
    stop: stop,
    isStarted: isStarted,

    currentTabId: currentTabId,
    getSettings: getSettings
  }
})();
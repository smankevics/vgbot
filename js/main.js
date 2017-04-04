var Bot = (() => {
    const minDelay = 500;
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
    
    let start = () => {
        Utils.getSelectedTab((tab) => {
            tabId = tab.id;

            //create scenes
            mainScene = MainScene(tabId);
            itemsOnTheGroundScene = ItemsOnTheGroundScene(tabId);
            selectEnemyScene = SelectEnemyScene(tabId);
            fightScene = FightScene(tabId);

            attachListener();
            started = true;
            lowHp = false;
            process();
        });
    }

    let stop = () => {
        removeListener();
        
        if(processTimeout)
            clearTimeout(processTimeout);
        
        nextMoveUp = false;
        started = false;
        lowHp = false;
    }

    let process = () => {
        Utils.getCurrentState(tabId, (state, body) => {
            if(state === Defines.states.DEFAULT) {
                mainScene.process(body);
            } else if(state === Defines.states.ITEMS_ON_THE_GROUND) {
                itemsOnTheGroundScene.process(body);
            } else if(state === Defines.states.SELECT_ENEMY) {
                selectEnemyScene.process(body);
            } else if(state === Defines.states.COMBAT) {
                fightScene.process(body);
            } else {
                Actions.refresh(tabId);
            }
        });
    }

    let pageRefreshHandler = (_tabId, _changeInfo, _tab) => {
        if(_tabId === tabId && started && _changeInfo.status === 'complete') {
            if(processTimeout)
                clearTimeout(processTimeout);

            processTimeout = setTimeout(process, Utils.rnd(minDelay, maxDelay));
        }
    };

    let attachListener = () => chrome.tabs.onUpdated.addListener(pageRefreshHandler);
    let removeListener = () => chrome.tabs.onUpdated.removeListener(pageRefreshHandler);
    let isStarted = () => started;

    return {
        start: start,
        stop: stop,
        isStarted: isStarted
    }
})();
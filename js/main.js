var Bot = (() => {
    const STATES = Utils.states;
    const minDelay = 500;
    const maxDelay = 2000;

    let processTimeout;
    let nextMoveUp = false;
    let tabId;
    let started = false;
    
    let start = () => {
        Utils.getSelectedTab((tab) => {
            tabId = tab.id;
            attachListener();
            started = true;
            process();
        });
    }

    let stop = () => {
        removeListener();
        
        if(processTimeout)
            clearTimeout(processTimeout);
        
        nextMoveUp = false;
        started = false;
    }

    let process = () => {
        Utils.getCurrentState((state) => {
            if(state === STATES.DEFAULT) {
                if(nextMoveUp)
                    Actions.up(tabId);
                else
                    Actions.down(tabId);

                nextMoveUp = !nextMoveUp;
            } else if(state === STATES.DEFAULT_ITEMS) {
                Actions.itemsOnTheGround(tabId);
            } else if(state === STATES.ITEMS_ON_THE_GROUND) {
                Actions.pickAllItems(tabId);
            } else if(state === STATES.COMBAT_SELECT_ENEMY) {
                Actions.selectEnemy(tabId);
            } else if(state === STATES.COMBAT_SELECT_ACTION) {
                Actions.hitEnemy(tabId);
            } else {
                Actions.refresh(tabId);
            }
        });
    }

    let pageRefreshHandler = (_tabId, _changeInfo, _tab) => {
        if(_tabId === tabId && started && _changeInfo.status === 'complete') {
            if(processTimeout)
                clearTimeout(processTimeout);

            console.log(_changeInfo);
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
var Bot = (() => {
    const minDelay = 500;
    const maxDelay = 2000;

    let processTimeout;
    let nextMoveUp = false;
    let tabId;
    let started = false;
    let lowHp = false;
    
    let start = () => {
        Utils.getSelectedTab((tab) => {
            tabId = tab.id;
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
        Utils.getCurrentState(tabId, (state, _lowHp) => {
            if(_lowHp)
                lowHp = _lowHp;
            
            if(state === Defines.states.DEFAULT) {
                if(lowHp) {
                    Actions.useHpPotion(tabId);
                    lowHp = false;
                } else  {
                    if(nextMoveUp)
                        Actions.up(tabId);
                    else
                        Actions.down(tabId);

                    nextMoveUp = !nextMoveUp;
                }
            } else if(state === Defines.states.DEFAULT_ITEMS) {
                Actions.itemsOnTheGround(tabId);
            } else if(state === Defines.states.ITEMS_ON_THE_GROUND) {
                Actions.pickAllItems(tabId);
            } else if(state === Defines.states.COMBAT_SELECT_ENEMY) {
                Actions.selectEnemy(tabId);
            } else if(state === Defines.states.COMBAT_SELECT_ACTION) {
                Actions.hitEnemy(tabId);
            } else if(state === Defines.states.COMBAT_END_TURN) {
                Actions.combatEndTurn(tabId);
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
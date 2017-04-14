var FightScene = (tabId, settings) => {
  let state = 0;

  let ckeckPageValidness = (cb) => {
    state++;
    let d = PageContent.getRoundData();
    if(d.playerPos >= -1 && d.enemyPos >= -1) {
      states[state](cb);
    } else {
      Actions.refresh(tabId);
      cb(Defines.stepResults.OK);
    }
  }

  let checkTurns = (cb) => {
    let d = PageContent.getRoundData();
    if(d && d.player && d.player.moves >= 2) {
      state++;

      //skip ckeck&equip weapon steps 
      if(!settings.autoEquipWeapon || settings.playerClass === 'Mage')
        state += 3;

      states[state](cb);
    } else {
      if(PageContent.getHtml().indexOf('"конец хода"') > -1) {
        Actions.combatEndTurn(tabId);
        cb(Defines.stepResults.OK);
      } else {
        Actions.refresh(tabId);
        cb(Defines.stepResults.OK);
      }
    }
  }

  let preHit = (cb) => {
    state++;
    if(settings.playerClass === 'Mage')
      Actions.castEnemy(tabId);
    else
      Actions.hitEnemy(tabId);
      
    cb(Defines.stepResults.OK);
  }

  let checkWeapon = (cb) => {
    let noWeapon = false;
    PageContent.getRoundData().logs.forEach((s) => {
      if(s.indexOf('оружием с точностью') > -1)
        noWeapon = true;
    });

    if(noWeapon) {
      //equip weapon
      state++;
      Actions.changeWeapon(tabId);
      cb(Defines.stepResults.OK);
    } else {
      //skip next step
      state += 2;
      states[state](cb);
    }
  }

  let equipWeapon = (cb) => {
    state++;
    let idm = Utils.getBestWeaponId(PageContent.getHtml());
    Actions.useEquipment(tabId, idm);
    cb(Defines.stepResults.OK);
  }

  let checkAutoHit = (cb) => {
    state++;

    if(settings.playerClass === 'Mage')
      Actions.autoCastCheckbox(tabId);
    else
      Actions.autoHitCheckbox(tabId);

    states[state](cb);
  }

  let hit = (cb) => {
    state++;

    if(settings.playerClass === 'Mage')
      Actions.castEnemy(tabId);
    else
      Actions.hitEnemy(tabId);

    cb(Defines.stepResults.OK);
  }

  const states = [
    ckeckPageValidness,
    checkTurns,
    preHit,
    checkWeapon,
    equipWeapon,
    checkAutoHit,
    hit
  ]

  return {
    process: (cb) => {
      if(state >= states.length)
        state = 0;
        
      states[state](cb);
    }
  }
};
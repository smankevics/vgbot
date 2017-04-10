var FightScene = (tabId, settings) => {
  let state = 0;

  let checkTurns = () => {
    let d = PageContent.getRoundData();
    if(d && d.player && d.player.moves >= 2) {
      state++;

      //skip ckeck&equip weapon steps 
      if(!settings.autoEquipWeapon)
        state += 3;

      states[state]();
    } else {
      if(PageContent.getHtml().indexOf('"конец хода"') > -1) {
        Actions.combatEndTurn(tabId);
      } else {
        Actions.refresh(tabId);
      }
    }
  }

  let preHit = () => {
    state++;
    if(settings.playerClass === 'Mage')
      Actions.castEnemy(tabId);
    else
      Actions.hitEnemy(tabId);
  }

  let checkWeapon = () => {
    let noWeapon = false;
    PageContent.getRoundData().logs.forEach((s) => {
      if(s.indexOf('оружием с точностью') > -1)
        noWeapon = true;
    });

    if(noWeapon) {
      //equip weapon
      state++;
      Actions.changeWeapon(tabId);
    } else {
      //skip next step
      state += 2;
      states[state]();
    }
  }

  let equipWeapon = () => {
    state++;
    let idm = Utils.getBestWeaponId(PageContent.getHtml());
    Actions.useEquipment(tabId, idm);
  }

  let checkAutoHit = () => {
    state++;

    if(settings.playerClass === 'Mage')
      Actions.autoCastCheckbox(tabId);
    else
      Actions.autoHitCheckbox(tabId);

    states[state]();
  }

  let hit = () => {
    state++;

    if(settings.playerClass === 'Mage')
      Actions.castEnemy(tabId);
    else
      Actions.hitEnemy(tabId);
  }

  const states = [
    checkTurns,
    preHit,
    checkWeapon,
    equipWeapon,
    checkAutoHit,
    hit
  ]

  return {
    process: () => {
      if(state >= states.length)
        state = 0;
        
      states[state]();
    }
  }
};
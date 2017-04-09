var FightScene = (tabId, settings) => {
  let state = 0;

  let checkTurns = () => {
    let d = PageContent.getRoundData();
    if(d && d.player && d.player.moves >= 2) {
      state++;
      states[state]();
    } else {
      if(PageContent.getHtml().indexOf('"конец хода"') > -1) {
        Actions.combatEndTurn(tabId);
      } else {
        Actions.refresh(tabId);
      }
    }
  }

  let checkWeapon = () => {
    state ++;
    if(!settings.autoEquipWeapon) {
      state++;
      return states[state]();
    }

    let noWeapon = false;
    PageContent.getRoundData().logs.forEach((s) => {
      if(s.indexOf('оружием с точностью') > -1)
        noWeapon = true;
    });

    if(noWeapon) {
      //equip weapon
      Actions.changeWeapon(tabId);
    } else {
      //skip next step
      state++;
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
    Actions.autoHitCheckbox(tabId);
    states[state]();
  }

  let hit = () => {
    state++;
    Actions.hitEnemy(tabId);
  }

  const states = [
    checkTurns,
    hit,
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
var Utils = (() => {
  let checkWeapon = (body, s, f) => {
    getCall('http://velgame.ru/main.php?blok=ekipir&rnd=' + Utils.getRnd(body), (response) => {
      let items = response
        .split('<')
        .map((s) => s.substring(s.indexOf('>') + 1))
        .filter((s) => s);

      let weaponIndex = items.indexOf(items.filter((o) => o.indexOf('Оружие') > -1)[0]);
      if (items[weaponIndex + 1].indexOf('Щит') > -1) {
        //no weapon
        s();
      } else {
        f();
      }
    }, f);
  }

  let equipWeapon = (body, f) => {
    let rnd = Utils.getRnd(body);
    getCall('http://velgame.ru/main.php?blok=meshok&wher=1&rnd=' + rnd, (content) => {
      let idm = getBestWeaponId(content);
      getCall('http://velgame.ru/main.php?blok=meshok&doo=1&ekip=7&wher=1&list=1&idm=' + idm + '&rnd=' + rnd, f, f);
    }, f)
  }

  let getCall = (url, success, fail) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (this.status == 200) {
          success(this.responseText);
        } else {
          fail();
        }
      }
    };
    xhr.send();
  }

  let getBestWeaponId = (body) => {
    let weapons = body
      .split('<a ')
      .map((s) => s.substring(0, s.indexOf('</a>')))
      .filter((s) => s.toLowerCase().indexOf('топор') > -1 || s.toLowerCase().indexOf('секира') > -1);

    let result = 0, best = 0;
    weapons.forEach((s) => {
      let it = s.split(' '),
        n = Number(it[it.length - 2]);
      if (n > best) {
        best = n;
        result = Number(s.match(/idm=[0-9]+/g)[0].split('=')[1]);
      }
    });
    return result;
  }

  return {
    getButtonByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.value.indexOf(name) > -1),
    getInputByName: (name) => Array.prototype.filter.call(document.getElementsByTagName("input"), (o) => o.name.indexOf(name) > -1),
    getLinkByHref: (name) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.href.indexOf(name) > -1),
    getLinkByText: (value) => Array.prototype.filter.call(document.getElementsByTagName("a"), (o) => o.text.indexOf(value) > -1),
    rnd: (min, max) => Math.floor((Math.random() * max) + min),
    getRnd: (body) => body.match(/rnd=[0-9]+/g),
    getIdm: (body) => body.match(/idm=[0-9]+/g),
    getBestWeaponId: getBestWeaponId,
    checkWeapon: checkWeapon,
    equipWeapon: equipWeapon
  }
})()
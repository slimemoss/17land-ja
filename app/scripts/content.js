const options = {
  childList: true, //直接の子の変更を監視
  characterData: true, //文字の変化を監視
  characterDataOldValue: true,//属性の変化前を記録
  attributes: true, //属性の変化を監視
  subtree: true, //全ての子要素を監視
}

const overwrite = (data) => {
  console.log('start')

  const div = document.querySelectorAll('div.list_card')

  div.forEach((d) => {
    const name = d.querySelector('div.list_card_name').textContent
    const eye = d.querySelector('div.tier_card_preview')
    for (const e of data) {
      if(name == e.name || name == e.name2) {
        const imgurl = e.image_uris
        const newimg = '<img src=' + imgurl + '/>'
        eye.innerHTML = newimg
        break
      }
    }
  })

  console.log('end')
}

var overwrited = false
const callback_init = (data) => {
  if (overwrited) {
    return
  }

  const div = document.querySelectorAll('div.list_card')
  if (div.length != 0) {
    overwrited = true

    const obs = new MutationObserver(() => {
      obs.disconnect()
      overwrite(data)
      obs.observe(target, options)      
    });
    const target = document.querySelector('div.scrolling-table')
    obs.observe(target, options);

    overwrite(data)
  }
}

const inner = (data) => {
  const obs_init = new MutationObserver(() => {
    obs_init.disconnect()
    callback_init(data)
    obs_init.observe(document, options)
  });
  obs_init.observe(document, options);
}

const url = 'https://raw.githubusercontent.com/slimemoss/17land-ja/master/app/scripts/data/woe.json'

fetch(url)
  .then(response => response.json())
  .then(data => inner(data))
  .catch(error => console.error('Error:', error));

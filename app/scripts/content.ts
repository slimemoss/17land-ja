// 17lands.comアップデートのたびに、更新する値
//   カード名・GIHが入ったdiv 挿絵用の長いstyleがあるやつ
let CSS_QUERY_CARD_BOX = 'div.sc-hIiahf'
//   カード名のdiv
let CSS_QUERY_CARDNAME = 'div.sc-gAigJI'
//   CSS_QUERY_OBSERVEを見つけるためのprint debug
let DEBUG_FOR_CSS_QUERY_OBSERVE = false
//   テーブル更新操作のたびに変化があるdiv
let CSS_QUERY_OBSERVE = ['sc-hYqwXO eMZNdb']

const appendImageAtt = 'data-17lands-ja-image'

interface URL_DATA_I {
  [key: string]: string
}

interface CssQueries {
  CSS_QUERY_CARD_BOX: string
  CSS_QUERY_CARDNAME: string
  CSS_QUERY_OBSERVE: string[]
}
async function fetchCssQueries() {
  const url = 'https://raw.githubusercontent.com/slimemoss/17land-ja/refs/heads/master/public_data/webpage_param.json'
  const response = await fetch(url)
  const res: CssQueries = await response.json()
  CSS_QUERY_CARDNAME = res.CSS_QUERY_CARDNAME
  CSS_QUERY_CARD_BOX = res.CSS_QUERY_CARD_BOX
  CSS_QUERY_OBSERVE = res.CSS_QUERY_OBSERVE
}

async function fetchData(expansion: string) {
  const url = 'https://raw.githubusercontent.com/slimemoss/17land-ja/refs/heads/master/public_data/' + expansion + '.json'
  const response = await fetch(url)
  const res: {[key: string]: string} = await response.json()
  return res
}

const ImageUrls = new class {
  imageUrls: {[key: string]: string} = {}
  fetched = new Set<string>()

  constructor() {}

  async update(expansion: string) {
    if(this.fetched.has(expansion)) {
      return
    }
    this.fetched.add(expansion)
    const data = await fetchData(expansion)
    this.imageUrls = {...this.imageUrls, ...data}

    const empty: {[key: string]: string} = {}
    const multi = Object.keys(data)
          .filter(key => key.includes(' // '))
          .reduce((prev, curr) => {
            return {...prev, [curr.split(' // ')[0]]: data[curr]}
          }, empty)
    this.imageUrls = {...this.imageUrls, ...multi}
  }

  has(name: string) {
    return name in this.imageUrls
  }

  url(name: string) {
    return this.imageUrls[name]
  }
}

const getExpansioin = () => {
  const select = document.querySelector<HTMLSelectElement>('select#expansion')
  return select?.value
}

function cardListHandler(_: MutationRecord[], obs: MutationObserver) {
  disconnect(obs)
  updatePage()
  observe(obs)
}

async function updatePage() {
  const expansion = getExpansioin()
  if(expansion == undefined || expansion == '') {
    return
  }

  if (DEBUG_FOR_CSS_QUERY_OBSERVE) {
    console.log('update')
  }

  await ImageUrls.update('SPG')
  await ImageUrls.update(expansion)
  document.querySelectorAll<HTMLDivElement>(CSS_QUERY_CARD_BOX).forEach(card => {
    let img = card.querySelector('img[' + appendImageAtt + ']')
    if(img == null) {
      img = document.createElement('img')
      card.appendChild(img)
    }
    img.setAttribute(appendImageAtt, '')

    const name = card.querySelector(CSS_QUERY_CARDNAME)?.textContent
    if(name) {
      const url = ImageUrls.url(name)
      img.setAttribute('src', url)
      img.removeAttribute('hidden')
      card.style.backgroundImage = ''
    }
  })
}

const observe = (obs: MutationObserver) => {
  obs.observe(document, { subtree: true, childList: true, characterDataOldValue: true })
}
const disconnect = (obs: MutationObserver) => {
  obs.disconnect()
}

const cardListObserver = (
  recoreds: MutationRecord[], obs: MutationObserver,
  callback: (recoreds: MutationRecord[], obs: MutationObserver) => void
) => {

  const isChange = recoreds.reduce((prev, curr) => {
    const shouldHandle = (curr: MutationRecord) => {
      const target = curr.target
      if (target instanceof Element) {
        if (DEBUG_FOR_CSS_QUERY_OBSERVE) {
          console.log(target.className)
        }
        return target.className == 'container' ||
               CSS_QUERY_OBSERVE.includes(target.className)
      } else {
        return false
      }
    }
    return shouldHandle(curr) || prev
  }, false)

  if(isChange) {
    callback(recoreds, obs)
  }
}

async function main() {
  fetchCssQueries()
  const obs = new MutationObserver((r, o) => cardListObserver(r, o, cardListHandler))
  observe(obs)
  cardListHandler([], obs)
}

main()

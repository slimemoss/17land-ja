interface URL_DATA_I {
  [key: string]: string
}
import DSK from './data/dsk.json'
import BLB from './data/blb.json'
import SPG from './data/spg.json'

const DataDict: {[key: string]: URL_DATA_I} = {
  'DSK': DSK,
  'BLB': BLB,
  'SPG': SPG
}

const appendImageAtt = 'data-17lands-ja-image'

const ImageUrls = new class {
  imageUrls: {[key: string]: string} = {}

  constructor() {}

  update(expansion: string) {
    if(!(expansion in DataDict)) {
      return
    }
    this.imageUrls = {...this.imageUrls, ...DataDict[expansion]}
  }

  has(name: string) {
    return name in this.imageUrls
  }

  url(name: string) {
    return this.imageUrls[name]
  }
}

ImageUrls.update('SPG')

const getNameFromListCardDiv = (div: Element) => {
  return div.querySelector('div.list_card_name')?.textContent ?? ''
}

const getExpansioin = () => {
  const select = document.querySelector<HTMLSelectElement>('select#expansion')
  return select?.value
}

const cardListHandler = () => {
  const listCardDivs = document.querySelectorAll('div.list_card')
  const expansion = getExpansioin()
  if(expansion) {
    ImageUrls.update(expansion)
  }

  listCardDivs.forEach(div => {
    let img = div.querySelector('img[' + appendImageAtt + ']')
    if(img == null) {
      img = document.createElement('img')
      div.appendChild(img)
    }
    img.setAttribute(appendImageAtt, '')
    img.setAttribute('hidden', 'true')

    const name = getNameFromListCardDiv(div)

    if(ImageUrls.has(name)){
      const url = ImageUrls.url(name)
      img.setAttribute('src', url)
      img.removeAttribute('hidden')
    }
  })
}

const cardListObserver = (
  recoreds: MutationRecord[], obs: MutationObserver,
  callback: (recoreds: MutationRecord[], obs: MutationObserver) => void
) => {

  const isChange = recoreds.reduce((prev, curr) => {
    return (
      curr.target.parentElement?.className == 'list_card_name' ||
      curr.target.parentElement?.querySelector('div.list_card_name') != null
    ) || prev
  }, false)

  if(isChange) {
    callback(recoreds, obs)
  }
}

const obs = new MutationObserver((r, o) => cardListObserver(r, o, cardListHandler))
obs.observe(document, { subtree: true, childList: true, characterDataOldValue: true })

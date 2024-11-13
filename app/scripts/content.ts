interface URL_DATA_I {
  [key: string]: string
}

const appendImageAtt = 'data-17lands-ja-image'

async function fetchData(expansion: string) {
  const url = 'https://raw.githubusercontent.com/slimemoss/17land-ja/refs/heads/url_data_from_githubraw/public_data/' + expansion + '.json'
  const response = await fetch(url)
  const res: URL_DATA_I = await response.json()
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
  }

  has(name: string) {
    return name in this.imageUrls
  }

  url(name: string) {
    return this.imageUrls[name]
  }
}

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
  if(expansion == undefined) {
    return
  }

  ImageUrls.update(expansion).then(() => {
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

const main = () => {
  ImageUrls.update('SPG').then(() => {
    const obs = new MutationObserver((r, o) => cardListObserver(r, o, cardListHandler))
    obs.observe(document, { subtree: true, childList: true, characterDataOldValue: true })
  })
}

main()

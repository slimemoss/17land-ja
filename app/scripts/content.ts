interface URL_DATA_I {
  [key: string]: string
}

const appendImageAtt = 'data-17lands-ja-image'

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

const cardListHandler = () => {
  const expansion = getExpansioin()
  if(expansion == undefined) {
    return
  }

  ImageUrls.update(expansion).then(() => {
    document.querySelectorAll('div.sc-hLznAM').forEach(box => {
      box.querySelectorAll<HTMLDivElement>('div.sc-glIahl').forEach(card => {
        let img = card.querySelector('img[' + appendImageAtt + ']')
        if(img == null) {
          img = document.createElement('img')
          card.appendChild(img)
        }
        img.setAttribute(appendImageAtt, '')

        const name = card.querySelector('div.sc-gACFrS')?.textContent
        if(name) {
          const url = ImageUrls.url(name)
          img.setAttribute('src', url)
          img.removeAttribute('hidden')
          card.style.backgroundImage = ''
        }
      })
    })
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
        return target.className == 'sc-hLznAM gvemIP' ||
               target.className == 'sc-ehYhRg kRLuxg'
      } else {
        return false
      }
    }
    return shouldHandle(curr) || prev
  }, false)

  if(isChange) {
    disconnect(obs)
    console.log('update')
    callback(recoreds, obs)
    console.log('end update')
    observe(obs)
  }
}

const main = () => {
  ImageUrls.update('SPG').then(() => {
    const obs = new MutationObserver((r, o) => cardListObserver(r, o, cardListHandler))
    observe(obs)
  })
}

main()

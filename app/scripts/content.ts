const appendImageAtt = 'data-17lands-ja-image'

const fetchUrls = (names: string[]): string[] => {
  const url = 'https://mtg-name2image-qycdsgzuoa-uc.a.run.app/image'
  const body = {format: 'small', cards: names}

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(body))
  return JSON.parse(xhr.responseText)
}

const ImageUrls = new class {
  requestedNames: Set<string> = new Set()
  imageUrls: {[key: string]: string} = {}

  constructor() {}

  update(names: string[]) {
    const unresolved = names.filter(n => !this.requestedNames.has(n))
    names.forEach(n => this.requestedNames.add(n))
    if (unresolved.length != 0) {
      const urls = fetchUrls(unresolved)
      unresolved.forEach((name, i) => {
        this.imageUrls[name] = urls[i]
      })
    }
  }

  url(name: string) {
    return this.imageUrls[name]
  }
}

const getNameFromListCardDiv = (div: Element) => {
  return div.querySelector('div.list_card_name')?.textContent ?? ''
}

const cardListHandler = () => {
  const listCardDivs = document.querySelectorAll('div.list_card')
  const names = [...listCardDivs].map(getNameFromListCardDiv)
  ImageUrls.update(names)

  listCardDivs.forEach(div => {
    let img = div.querySelector('img[' + appendImageAtt + ']')
    if(img == null) {
      img = document.createElement('img')
      div.appendChild(img)
    }
    img.setAttribute(appendImageAtt, '')
    img.setAttribute('hidden', 'true')

    const name = getNameFromListCardDiv(div)
    const url = ImageUrls.url(name)
    if(url) {
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

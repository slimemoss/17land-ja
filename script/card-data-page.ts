// XPath
// scroll table   (div.scrolling-table)
// table          (div)
// row            (div) list
// rank box       (div) list
// card           (div) list
// card element   (div)
//   card detail    (a)
//   empty          (div)
//   gih            (div)

import { imageUrlDatabase } from "./fetch-set-data"

const xpathResultArray = (parent: Node, xpathStr: string) => {
  const result = document.evaluate(
    xpathStr,
    parent,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )
  return Array.from({ length: result.snapshotLength }, (_, i) => result.snapshotItem(i))
}


const isMatchingDescendant = (target: Node, parent: Node, xpathStr: string) => {
  const possible_card = document.evaluate(
    xpathStr, parent, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  )
  const nodes = Array.from(
    { length: possible_card.snapshotLength },
    (_, i) => possible_card.snapshotItem(i))
  const isDescendant = nodes.reduce((acc, node) => acc || node === target, false)
  return isDescendant
}

export const isChageTable = (r: MutationRecord[]): boolean => {
  const scrollTable = document.querySelector("div.scrolling-table")
  if(scrollTable == null) {
    return false
  }

  for(const record of r) {
    // マウスオーバーしたときにカードが拡大される処理の場合
    if(isMatchingDescendant(record.target, scrollTable, ".//div/div/div/div")){
      continue
    }

    if (scrollTable.contains(record.target)) {
      return true
    }

    for(const added of Array.from(record.addedNodes)) {
      if (scrollTable.contains(added)) {
	return true
      }
    }
  }

  return false
}

const ATTRIBUTE_INSERT_DOM = 'data-17lands-ja-insert-image'

const updateCardCell = (target: HTMLDivElement, getUrl: (name: string) => string) => {
  const name = target.querySelector<HTMLAnchorElement>('a').text
  const url = getUrl(name)

  let img = target.querySelector('img[' + ATTRIBUTE_INSERT_DOM + ']')
  if(img == null) {
    img = document.createElement('img')
    target.appendChild(img)
  }
  img.setAttribute(ATTRIBUTE_INSERT_DOM, '')
  img.setAttribute('src', url)
  img.removeAttribute('hidden')
  target.style.backgroundImage = ''
}

export async function updateScrollTable() {
  const scrollTable = document.querySelector("div.scrolling-table")
  if(scrollTable == null) {
    return
  }

  const code = document.querySelector<HTMLSelectElement>("select#expansion").value
  if(code === undefined) {
    return
  }
  await imageUrlDatabase.update("spg")
  await imageUrlDatabase.update(code)

  const cards = xpathResultArray(scrollTable, "./div/div/div/div")
  cards.forEach(card => {
    if (card instanceof HTMLDivElement) {
      updateCardCell(card, (name) => imageUrlDatabase.url(name))
    }
  })
}

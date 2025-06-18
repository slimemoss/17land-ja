import { debounce } from "lodash"
import type { PlasmoCSConfig } from "plasmo"
import { isChageTable, updateScrollTable } from "~script/card-data-page";
import { observePageTransition } from "~script/observe-page-transition";


export const config: PlasmoCSConfig = {
  matches: ["*://www.17lands.com/*"],
  all_frames: true
}

export const start_observe = (obs: MutationObserver) => {
  const config = { attributes: true, childList: true, subtree: true };
  obs.observe(document, config)
}

export const stop_observe = (obs: MutationObserver) => {
  obs.disconnect()
}

const debouncedChangeTableHandler = debounce(
  (r: MutationRecord[], o: MutationObserver) => {
    changeTableHandler(r, o)
  },
  1000, // 単位: ミリ秒、必要に応じて調整
  { leading: false, trailing: true }
)


let isHandling = false
async function changeTableHandler(r: MutationRecord[], o:MutationObserver) {
  console.log('try update')

  stop_observe(o)
  if (isHandling) return
  isHandling = true

  if (isChageTable(r)) {
    await updateScrollTable()
  }
  start_observe(o)
  isHandling = false
}

function main() {
  const obs = new MutationObserver((r, o) => {
    debouncedChangeTableHandler(r, o)
  })

  observePageTransition(
    (url: string) => url.startsWith("https://www.17lands.com/card_data"),
    () => {
      start_observe(obs)
    },
    () => {
      stop_observe(obs)
  })
}

main()

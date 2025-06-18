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

async function changeTableHandler(r: MutationRecord[], o:MutationObserver) {
  if (isChageTable(r)) {
    stop_observe(o)
    await updateScrollTable()
    start_observe(o)
  }
}

function main() {
  const obs = new MutationObserver((r, o) => {
    changeTableHandler(r, o)
  })

  observePageTransition(
    (url: string) => url.startsWith("https://www.17lands.com/card_data"),
    () => start_observe(obs),
    () => stop_observe(obs))
}

main()

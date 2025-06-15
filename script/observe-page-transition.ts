export const observePageTransition = (
  isTargetUrl: (url: string) => boolean,
  onEnterPage: () => void,
  onLeavePage: () => void
) => {

  navigation.onnavigatesuccess = (event) => {
    const navEvent = event.target as Navigation
    const enterUrl = navEvent.currentEntry.url

    if(isTargetUrl(enterUrl)) {
      onEnterPage()
    } else {
      onLeavePage()
    }
  }
}

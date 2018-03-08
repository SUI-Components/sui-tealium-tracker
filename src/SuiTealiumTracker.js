import { FunctionThrottler } from './FunctionThrottler'
import { dispatchEvent } from '@s-ui/js/lib/events'

const ELEMENTS_CLICKABLE = ['A', 'BUTTON', 'DIV', 'INPUT', 'SVG']
const ELEMENT_NODE = 1
const THROTTLE_WAIT = 100

/**
 * SuiTealiumTracker
 */
export class SuiTealiumTracker {
  constructor ({customEventName, handleAnchorDelay} = {}) {
    this.customEventName = customEventName
    this.handleAnchorDelay = handleAnchorDelay
    this.sendTealiumThrottled = FunctionThrottler.throttle(this.sendTealium, THROTTLE_WAIT)
  }

  init () {
    this.initClickListener()
    this.initChangeListener()
    this.customEventName && this.promoteDispatchCustomEventToWindow()
    this.customEventName && this.initCustomEventListener()
  }

  initClickListener () {
    document.addEventListener('click', (e) => {
      let target = e.target
      let node = target
      do {
        if (node.nodeType !== ELEMENT_NODE) { break }
        this.checkIfNeedToTrackClick({node, e})
        const parentTagName = node.parentElement && node.parentElement.tagName.toUpperCase()
        // search if the parent is a clickable element to check, otherwise we stop
        node = ELEMENTS_CLICKABLE.includes(parentTagName) ? node.parentElement : false
      } while (node)
    })
  }

  initChangeListener () {
    document.addEventListener('change', ({target}) => {
      const {options = [], selectedIndex = 0} = target
      const option = options[selectedIndex] || {dataset: {}}
      const {tealiumTag} = option.dataset
      if (tealiumTag) {
        this.sendTealiumThrottled(tealiumTag)
      }
    })
  }

  initCustomEventListener () {
    document.addEventListener(this.customEventName, (evt) => {
      const {tealiumTag} = evt.detail
      this.sendTealiumThrottled(tealiumTag)
    })
  }

  checkIfNeedToTrackClick ({ node, e }) {
    const { dataset = {} } = node
    const { tealiumTag } = dataset
    let args = [dataset]
    tealiumTag && node.tagName === 'A' && this.handleAnchorDelay && args.push(this.delayAnchorLinkCall(e))
    tealiumTag && this.sendTealiumThrottled.apply(this, args)
  }

  delayAnchorLinkCall (e) {
    e.preventDefault()
    return () => {
      setTimeout(() => window.location.replace(e.target.href), 300)
    }
  }

  promoteDispatchCustomEventToWindow () {
    window.dispatchCustomEvent = (detail) => dispatchEvent({ eventName: this.customEventName, detail })
  }

  sendTealium (data, callback) {
    const args = [{...window.utag_data, ...data}]
    callback && args.push(callback)
    window.utag ? window.utag.link.apply(window.utag, args) : console.warn('There is no utag present on this site no event was dispatched.')
  }
}

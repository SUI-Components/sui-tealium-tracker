/* eslint-env mocha */
import { expect } from 'chai'
import sinon from 'sinon'
import { FunctionThrottler } from '../src/FunctionThrottler'

describe('FunctionThrottler', () => {
  let callback
  let throttledFunction
  before(() => {
    callback = sinon.spy()
    throttledFunction = FunctionThrottler.throttle(callback, 200)
  })

  it('should call the callback at first execution instantly', () => {
    let clock = sinon.useFakeTimers()
    throttledFunction()
    expect(callback.callCount).to.be.equal(1)
    clock.tick(500)
  })

  it('should preserve the gap by configuration 200MS between calls', () => {
    let clock = sinon.useFakeTimers()
    callback.resetHistory()
    clock.tick(100)
    setTimeout(() => {
      throttledFunction()
    }, 150)
    setTimeout(() => {
      throttledFunction()
    }, 160)
    setTimeout(() => {
      throttledFunction()
      expect(callback.callCount).to.be.equal(2)
    }, 200)
    clock.tick(100)
  })
})

import { Router } from 'express'
import * as express from 'express'
import { bindContainer, bindRoute, bindContainerProps } from './bind-cfg'
let deepAssign = require('deep-assign')


let makeHandler = (fn) => (a1) => {
  let configRouter = (router, target) => {
    let o = target.__express_decorator
    let d = target.prototype.__express_decorator
    let cfg = deepAssign({}, o, d)
    bindContainer(router, cfg)
    bindRoute(router, cfg)
  }

  let a1isConfig = typeof a1 === 'object'

  if (a1isConfig) {
    let optionedRouterHandler = (target) => {
      let router = fn(a1)
      router.__base_class = a1
      configRouter(router, target)
      bindContainerProps(router, a1)
      return router
    }
    return optionedRouterHandler
  }
  let router = fn()
  router.__base_class = a1
  configRouter(router, a1)

  return router as any
}

export let ExpressRouter = makeHandler((opt = {}) => Router(opt))

export let ExpressApp = makeHandler(() => express())
import { Router } from 'express'
import * as express from 'express'

let makeHandler = (fn) => (a1) => {
  let configRouter = (router, target) => {
    let o = target.__express_decorator
    let d = target.prototype.__express_decorator

    if (o && o.option) {
      if (o.option.middlewares) {
        router.use(o.option.middlewares)
      }
    }

    if (d && d.route) {
      for (let t in d.route) {
        let item = d.route[t]
        if (item.method) {
          let args = [item.path, ...item.middlewares, item.handler]
          router[item.method].apply(router, args)
        }
      }
    }
  }

  if (typeof a1 === 'object') {
    return (target) => {
      let router = fn(a1)
      configRouter(router, target)
      return router
    }
  }
  let router = fn()
  configRouter(router, a1)

  return router as any
}

export let ExpressRouter = makeHandler((opt = {}) => Router(opt))

export let ExpressApp = makeHandler(() => express())
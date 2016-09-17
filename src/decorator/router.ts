import { Router } from 'express'
import * as express from 'express'
import { parse } from 'url'
let deepAssign = require('deep-assign')

let bindContainer = (router, cfg) => {
  if (!cfg) return
  if (cfg.option && cfg.option.middlewares) {
    router.use(cfg.option.middlewares)
  }
  if (cfg.param) {
    for (let t in cfg.param) {
      router.param(t, cfg.param[t])
    }
  }
}
let bindRoute = (router, cfg) => {
  if (!cfg) return

  let msHandler = (getQuery, handler) => async(req, res, next) => {
    let query = getQuery(req)
    let ended = false
    res.on('end', () => ended = true)
    let result = await handler(query, req, res, next)
    if (!ended) {
      res.json(result)
    }
  }

  if (cfg.route) {
    for (let t in cfg.route) {
      let item = cfg.route[t]
      let args, handler
      switch (item.method) {
        case '_msqs':
          handler = msHandler((req) => parse(req.url, true).query, item.handler)
          args = [item.path, ...item.middlewares, handler]
          router.get.apply(router, args)
          break
        case '_msbd':
          handler = msHandler((req) => parse(req.body, true).query, item.handler)
          args = [item.path, ...item.middlewares, handler]
          router.post.apply(router, args)
          break
        default:
          args = [item.path, ...item.middlewares, item.handler]
          router[item.method].apply(router, args)
      }
    }
  }
}

let bindContainerProps = (router, props) => {
  if (!props) return
  for (let k in props) {
    switch (k) {
      case 'set':
        for (let s in props.set) {
          router.set(s, props.set[s])
        }
        break
      case 'locals', 'mountpath':
        router[k] = props[k]
        break
      // not to provide listen method to probably confuse others
    }
  }
}


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
      configRouter(router, target)
      bindContainerProps(router, a1)
      return router
    }
    return optionedRouterHandler
  }
  let router = fn()
  configRouter(router, a1)

  return router as any
}

export let ExpressRouter = makeHandler((opt = {}) => Router(opt))

export let ExpressApp = makeHandler(() => express())
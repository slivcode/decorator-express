import { Router } from 'express'
import * as express from 'express'
import { parse } from 'url'

let makeHandler = (fn) => (a1) => {
  let configRouter = (router, target) => {
    let o = target.__express_decorator
    let d = target.prototype.__express_decorator


    // bind container
    if (o && o.option) {
      if (o.option.middlewares) {
        router.use(o.option.middlewares)
      }
    }

    if(d && d.param) {
      for (let t in d.param) {
        router.param(t, d.param[t])
      }
    }

    // bind methods
    if (d && d.route) {
      for (let t in d.route) {
        let item = d.route[t]
        if (item.method) {
          if (item.method.startsWith('_ms')) {
            // microserivice return style
            let handler = async(req, res, next) => {
              let query
              switch (item.method) {
                case '_msqs':
                  query = parse(req.url, true).query
                  break
                case '_msbd':
                  query = req.body
                  break
              }
              let ended = false
              res.on('end', () => ended = true)
              let result = await item.handler(query, req, res, next)
              if (!ended) {
                res.json(result)
              }
            }
            let args = [item.path, ...item.middlewares, handler]
            router.post.apply(router, args)
          } else {

            // traditional GET, POST, DELETE, etc.
            let args = [item.path, ...item.middlewares, item.handler]
            router[item.method].apply(router, args)
          }
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
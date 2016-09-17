import { USE } from '../decorator/middleware'
import { test } from 'ava'
import * as supertest from "supertest-as-promised"
import * as express from 'express'
import { createMethodDecorator } from '../util/method-decorator'
import { ExpressRouter, ExpressApp } from '../decorator/router'
import { GET, POST } from '../decorator/method'
import { spy } from 'sinon'
import { PARAM } from '../decorator/params'
import { MSQS } from '../decorator/microservice'

test('outer option test', (t) => {
  let GET = createMethodDecorator('get')
  let POST = createMethodDecorator('post')
  class App {
    @GET('/')
    r() {
      return 'root'
    }

    @POST('/')
    c() {

    }
  }
  let d = (App.prototype as any).__express_decorator.route
  t.truthy(d)
  t.truthy(d.c)
  t.is(d.c.method, 'post')
  t.is(typeof d.c.handler, 'function')
  t.truthy(d.r)
  t.is(d.r.method, 'get')
  t.is(typeof d.r.handler, 'function')
  t.is(d.r.handler(), 'root')
})

test('express router decorator test', async(t) => {
  let helloStr = 'posted hello'
  @ExpressRouter
  class App {
    @GET('/')
    r(req, res) {
      res.send('test')
    }

    @POST(['/hello'])
    hello(req, res) {
      res.send(helloStr)
    }
  }
  let _App: any = App
  t.is(typeof _App.get, 'function')

  let app = express()
  app.use(_App)
  let EP = supertest(app)
  let resp = await EP.get('/')
  t.is(resp.status, 200)
  resp = await EP.post('/hello')
  t.is(resp.status, 200)
  t.is(resp.text, helloStr)
})

test('express app decorator test', async(t) => {
  @ExpressApp
  class App {
    @GET('/')
    hp(req, res) {
      res.send('hello world')
    }
  }
  let EP = supertest(App)
  let resp = await EP.get('/')
  t.is(resp.status, 200)
})


test('middleware decorator test', async(t) => {
  let mid1 = spy((req, res, next) => {
    next()
  })
  let mid2 = spy((req, res, next) => {
    next()
  })

  class App {
    @GET('/')
    @USE(mid1, mid2)
    hp(req, res) {
      res.send('hello world')
    }
  }
  let _App: any = App
  let d = _App.prototype.__express_decorator
  t.truthy(d)
  t.truthy(d.route.hp)
  t.is(d.route.hp.middlewares.length, 2)

  @ExpressApp
  class App2 {
    @GET('/')
    @USE(mid1, mid2)
    hp(req, res) {
      res.send('hello world')
    }
  }
  let EP = supertest(App2)
  await EP.get('/')
  t.truthy(mid1.calledOnce)
  t.truthy(mid2.calledOnce)
})

test('middleware router test', async(t) => {
  let mid3 = spy((req, res, next) => {
    next()
  })
  let mid4 = spy((req, res, next) => {
    next()
  })

  @ExpressApp
  @USE(mid3, mid4)
  class App {
    @GET('/')
    hp(req, res) {
      res.send('done')
    }
  }
  let EP = supertest(App)
  await EP.get('/')
  t.truthy(mid3.calledOnce)
  t.truthy(mid4.calledOnce)
})

test('optioned router decorator', async(t) => {

  @ExpressRouter({caseSensitive: true})
  class cIrouter {
    @GET('/HELLO')
    ciRoute(req, res) {
      res.send('done')
    }
  }

  @ExpressApp
  @USE(cIrouter)
  class App {

  }

  let EP = supertest(App)
  let resp = await EP.get('/hello')
  t.is(resp.status, 404)
  resp = await EP.get('/HELLO')
  t.is(resp.status, 200)
})

test('microservice style decorator test', async(t) => {
  @ExpressApp
  class App {
    @MSQS('/')
    async index({name}) {
      return await Promise.resolve({ans: {name}})
    }
  }

  let EP = supertest(App)
  let resp = await EP.get('/?name=something')
  t.is(resp.status, 200)
  t.is(JSON.stringify(resp.body), JSON.stringify({ans: {name: 'something'}}))
})

test('param test', async(t) => {
  @ExpressApp
  class App {

    @PARAM('id')
    addId(req, res, next, id) {
      req.user = id
      next()
    }

    @GET('/:id')
    async index(req, res) {
      res.send(req.user)
    }
  }

  let EP = supertest(App)
  let resp = await EP.get('/123')
  t.is(resp.text, '123')

})

test('express app setting decorator test', async(t) => {
  @ExpressApp({set: {'x-powered-by': false}, mountpath: '/test'})
  class App {

  }
  t.is((App as any).get('x-powered-by'), false)
  t.is((App as any).mountpath, '/test')
})
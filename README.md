# decorator-express

[![Build Status](https://travis-ci.org/slivcode/decorator-express.svg?branch=develop)](https://travis-ci.org/slivcode/decorator-express)
[![Coverage Status](https://coveralls.io/repos/github/slivcode/decorator-express/badge.svg?branch=develop)](https://coveralls.io/github/slivcode/decorator-express?branch=develop)

```js
import {ExpressRouter, ExpressApp, USE, POST} from 'decorator-express'

@ExpressRouter
@USE(morgan('combined'))
class UserRoute {
  @POST('/')
  @USE(bodyParser.json())
  async info(req, res){
    res.send(await Promise.resolve('INFO'))
  }
  
  
  // GET /ms?x=10&y=20
  @MSQS('/ms')
  async ms({x,y}, req, res) {
    return await Promise.resolve(x + y)
  }
  
}


@ExpressApp
@USE(helmet(), UserRoute)
class App {
  
}

http.createServer(App).listen(4000)
```
# decorator-express

[![Build Status](https://travis-ci.org/slivcode/decorator-express.svg?branch=develop)](https://travis-ci.org/slivcode/decorator-express)
[![Coverage Status](https://coveralls.io/repos/github/slivcode/decorator-express/badge.svg?branch=develop)](https://coveralls.io/github/slivcode/decorator-express?branch=develop)

```js
import {ExpressRouter, ExpressApp, USE, POST} from 'decorator-express'

@ExpressRouter
class UserRoute {
  @POST('/')
  @USE(bodyParser.json())
  async info(req, res){
    res.send(await Promise.resolve('INFO'))
  }
}


@ExpressApp
@USE(UserRoute)
class App {
  
}

http.createServer(App).listen(4000)
```
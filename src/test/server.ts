import { json } from 'body-parser'
import { ExpressApp } from '../decorator/router'
import { GET } from '../decorator/method'
import { PATTERN } from '../decorator/microservice'
import { USE } from '../decorator/middleware'


@ExpressApp
@USE(json())
class App {
  static listen

  @PATTERN({hello: 'world'})
  async hp(arg) {
    return arg
  }

  @PATTERN({hello: 'world', cool: 'kid'})
  async n(arg) {
    return 'cool kid'
  }
}

App.listen(4000)
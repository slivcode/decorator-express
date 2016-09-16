let deepAssign = require('deep-assign')

// TODO: refactor this to make sense of both class and method decorator
export let initDecorator = (target) => {
  if (!target.__express_decorator) {
    target.__express_decorator = {param: {}, option: {}, route: {}}
  }
}

export let assignDecorator = (target, ...args) => {
  deepAssign(target.__express_decorator, ...args)
}
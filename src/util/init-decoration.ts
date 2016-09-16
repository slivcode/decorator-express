let deepAssign = require('deep-assign')

export let initDecorator = (target) => {
  if (!target.__express_decorator) {
    target.__express_decorator = {option: {}, route: {}}
  }
}

export let assignDecorator = (target, ...args) => {
  deepAssign(target.__express_decorator, ...args)
}
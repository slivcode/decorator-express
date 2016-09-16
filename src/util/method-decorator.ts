import { initDecorator, assignDecorator } from './init-decoration'

export let createMethodDecorator = (method: string) => {
  return (path: string | RegExp | any[], opt?) => (target, propName, desc: TypedPropertyDescriptor<any>) => {
    initDecorator(target)
    assignDecorator(target, {route: {[propName]: {path, method, middlewares: [], handler: desc.value}}})
  }
}
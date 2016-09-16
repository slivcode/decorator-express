import { initDecorator, assignDecorator } from '../util/init-decoration'
export let PARAM = (id) => (target, propName, desc) => {
  initDecorator(target)
  assignDecorator(target, {param: {[id]: desc.value}})
}
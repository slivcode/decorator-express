import { createMethodDecorator } from '../util/method-decorator'
// microservice style handling

export let MSQS = createMethodDecorator('_msqs')
export let MSBD = createMethodDecorator('_msbd')

export let PATTERN = createMethodDecorator('_pattern')
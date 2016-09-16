import { createMethodDecorator } from '../util/method-decorator'
export let GET = createMethodDecorator('get')
export let POST = createMethodDecorator('post')
export let DELETE = createMethodDecorator('delete')
export let PATCH = createMethodDecorator('patch')
export let PUT = createMethodDecorator('put')
export let ALL = createMethodDecorator('all')

// microservice style handling
export let MSQS = createMethodDecorator('_msqs')
export let MSBD = createMethodDecorator('_msbd')

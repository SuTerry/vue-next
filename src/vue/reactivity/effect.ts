// 用来存放target的key: Dep
type KepToDepMap = Map<any, Dep>
// Dep 是一个Set集合，里面存放着ReactiveEffect
type Dep = Set<ReactiveEffect>


/**
 * 
 */
export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: boolean
  id: number
  raw: () => T
  deps: Array<Dep>
  options: ReactiveEffectOptions
}

/**
 * effect选项
 * lazy: 为true时，不马上执行fn函数
 * scheduler: 
 * onStop: 
 */
export interface ReactiveEffectOptions {
  lazy?: boolean
}

// 用来存放target: KepToDepMap
const targetMap = new WeakMap<any, KepToDepMap>()
// effect执行前推入数组，执行后弹出数组
const effectStack: ReactiveEffect[] = []
// 当前正在执行的effect
let activeEffect: ReactiveEffect | undefined
// effect 升序id
let uid = 0

export function isEffect(fn: any): fn is ReactiveEffect {
  return fn && fn._isEffect
}

export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = Object.freeze({})
): ReactiveEffect<T> {
  // 传入的fn如果是ReactiveEffect，把fn重新赋值为原始的函数
  if (isEffect(fn)) fn = fn.raw
  // 创建effect
  const effect = createReactiveEffect(fn, options)
  // lazy属性不为true时，执行effect
  if (!options.lazy) effect()
  // 返回effect
  return effect
}

function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): T {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++
  effect.raw = fn
  effect._isEffect = true
  effect.deps = []
  effect.options = options
  return effect
}
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

// 所有定义的reactive不为只读类型的集合
export const reactiveMap = new WeakMap<Target, any>()
// 所有定义的reactive为只读类型的集合
export const readonlyMap = new WeakMap<Target, any>()

export function reactive(target: object) {
  // 当target为只读属性时，直接返回target
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) return target

  return
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // target不是一个对象类型时，直接返回本身
  if (target !== null && typeof target === 'object') return target

  // 当target为只读且isReadonly参数也为只读时，直接返回本身
  if (target[ReactiveFlags.RAW] && !(isReadonly && target[ReactiveFlags.IS_READONLY])) return target

  // 根据是否只读属性来决定用哪个集合来存取
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  // 尝试从集合中获取当前target对应的proxy
  const existingProxy = proxyMap.get(target)
  // 查看集合中是否有当前target对应的proxy，有的话直接返回proxy
  if (existingProxy) return existingProxy
  // 以下操作为target未使用代理的情况
  
}
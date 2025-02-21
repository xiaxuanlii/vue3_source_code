import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    console.log('get', key);
    if(key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, key)
    
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('set', key);

    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver);
    if(oldValue!==value) {
      trigger(target, key, value, oldValue)
    }
    return result
  }

}
import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    console.log(key, 'get');
    if(key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, key)
    
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(key, 'set');

    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver);
    if(oldValue!==value) {
      trigger(target, key, value, oldValue)
    }
    return result
  }

}
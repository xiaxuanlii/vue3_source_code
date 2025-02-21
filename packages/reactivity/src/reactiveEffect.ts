import { activeEffect, trackEffect, triggerEffects } from "./effect";

//保存了target的映射信息, key为target, 值为depsMap
/* 
targetMap(WeakMap): {
  target->obj: depsMap(Map) -> {
    key1->age: dep(Map) -> {
      cleanup: ()=>{fn},
      name: key->age,
      key1->effect: effect._trackId
    },
    key2->name: dep(Map) -> {
      cleanup: ()=>{fn},
      name: key->name,
      key2->effect: effect._trackId
    }
  }
}
inteface effect {
  active: true
  id: xxx,
  _trackid: 0
  deps: [dep]
}
*/
const targetMap = new WeakMap() 

function createDep (cleanup, name) {
  let dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = name
  return dep
}
export function track(target, key) {
  if(activeEffect) {
    // console.log('track', key, activeEffect);
    let depsMap = targetMap.get(target)
    if(!depsMap) {
      targetMap.set(target, depsMap = new Map())
    }

    let dep = depsMap.get(key)
    if(!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key), key))
    }
    //应该只在函数首次run, get数据的时候tranck. set数据后, trigger会导致fn再次run, 这个时候的get数据, 不应该再次tranck 
    trackEffect(activeEffect, dep)
    console.log(`${JSON.stringify(target)}的${key}有${dep.size}个收集的effect`)
  }
}

export function trigger(target, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if(!depsMap) return
  const dep = depsMap.get(key)
  if(dep) {
    triggerEffects(dep)
  }
}
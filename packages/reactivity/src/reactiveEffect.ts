import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap() 

function createDep (cleanup, name) {
  let dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = name
  return dep
}
export function track(target, key) {
  if(activeEffect) {
    // console.log(key, activeEffect);
    let depsMap = targetMap.get(target)
    if(!depsMap) {
      targetMap.set(target, depsMap = new Map())
    }

    let dep = depsMap.get(key)
    if(!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key), key))
    }

    trackEffect(activeEffect, dep)
    
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
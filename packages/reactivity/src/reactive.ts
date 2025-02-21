// pnpm install @vue/shared --workspace --filter @vue/reactivity --verbose 可以将workspace的shared安装为当前子项目的依赖
//引入@vue/shared就是引入packages/shared/src
import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandlers } from "./baseHandler";

const reactiveMap = new WeakMap()

function createReactiveObject(target) {
  //不是对象的情况判断
  if(!isObject(target)) {
    return target;
  }

  //对reactive过的对象再次reactive的情况判断 ->
  //这里访问target的'ReactiveFlags.IS_REACTIVE', 如果被代理过, 就会走到get方法, get方法返回true. 没有被代理过, 访问这个属性就是undefined
  if(target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  //对一个相同引用的对象reactive两次的情况判断
  const exitsProxy = reactiveMap.get(target)
  if(exitsProxy) {
    return exitsProxy
  }
  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  return createReactiveObject(target)
}
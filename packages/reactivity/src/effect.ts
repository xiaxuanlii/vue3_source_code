export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()

  return _effect
}

export let activeEffect;

class ReactiveEffect {
  public active = true
  public id = crypto.randomUUID()
  _trackId = 0
  deps = []
  _depsLength = 0
  constructor(public fn, public scheduler) {}
  
  run() {
    console.log('effect run', this.fn);
    
    if(!this.active) {
      return this.fn();
    }
    let lastEffect = activeEffect
    try{
      activeEffect = this
      return this.fn()
    }finally{
      activeEffect = lastEffect
    }
  }
}

export function trackEffect(effect, dep) {
  //这里做特判, 避免set时重复track
  if(!dep.get(effect)) dep.set(effect, effect._trackId)
  if(!effect.deps.includes(dep)) effect.deps[effect._depsLength++] = dep
  console.log(`effect_id -> ${effect.id}有${effect._depsLength}个dep需要更新`)
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if(effect.scheduler) {
      effect.scheduler()
    }
  }
}
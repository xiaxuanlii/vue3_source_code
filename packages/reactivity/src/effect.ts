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
    console.log('effect run');
    
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
  dep.set(effect, effect._trackId)
  effect.deps[effect._depsLength++] = dep
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if(effect.scheduler) {
      effect.scheduler()
    }
  }
}
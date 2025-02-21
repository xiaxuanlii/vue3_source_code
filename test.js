
let o = {
  name: 'xxl',
  get getName(){
    // console.log(this);
    return this.name + 'hhhh'
  }
}
let proxyO = new Proxy(o, {
  get(target, key, recevier) {
    console.log(key);
    if(key === 'name') {
      target.name = 'xxx2'
    }
    return Reflect.get(target, key, recevier)
  }
})
// o.name = 'xxl2'
console.log(proxyO.getName);
// console.log(proxyO);


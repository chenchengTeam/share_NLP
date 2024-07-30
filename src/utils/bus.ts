class MyBus {
  busList = {};

  constructor() {}

  $on(fnName: any, fn: any) {
    if (this.busList[fnName]) throw console.error("事件名称重复!");
    // if (this.busList[fnName]) return;
    this.busList[fnName] = fn;
  }

  // $emit(fnName: any) {
  //   const args = [...arguments].slice(1);
  //   this.busList[fnName](...args);
  // }

  $emit(fnName, ...args) {
    if (typeof this.busList[fnName] === "function") {
      this.busList[fnName](...args);
    } else {
      console.warn(` ${fnName} is not definition.`);
    }
  }

  $off(fnName: any) {
    if (!this.busList[fnName]) return;
    delete this.busList[fnName];
  }
}

let bus = new MyBus();

export { bus };

class Op {
  constructor() {
    this.h = 13;
  }

  min() {
    console.log('min', this.toNumber());
  }
}

class Candle extends Op {
  constructor() {
    super();
    this.p = 2;
  }

  toNumber() {
    return 5;
  }

  get T() {
    return this.p * this.h;
  }
}

const $ = function x() {
  console.log('called');
};
Object.assign($, new Candle());
$.__proto__ = Candle.prototype;

$();
console.log('toNumber', $.toNumber());
$.min();
console.log($ instanceof Candle);
console.log($ instanceof Op);
console.log('T  = ', $.T);

import * as indicators from '../indicators';
import { assert } from '../util';
import { DataPoint } from '../indicators/interface';
import { ComputationNode, ExecutionContext } from './nodes';

export type Numeric = number | Operation;

export abstract class Operation extends ComputationNode {
  protected _mathOp(values: Numeric[], fn: (...args: number[]) => number) {
    return new MathOperation([this, ...values.map(toOperation)], fn);
  }

  /**
   * Add multiple numbers to the result of this value and return the new value.
   * @param values Primitive numbers or computational units to add.
   */
  add(...values: Numeric[]): Operation {
    return this._mathOp(values, MathOperation.add);
  }

  /**
   * Subtract the given numbers from this node.
   * @param values Other numbers.
   */
  sub(...values: Numeric[]): Operation {
    return this._mathOp(values, MathOperation.sub);
  }

  /**
   * Multiply this and other numbers together.
   * @param values Other numbers.
   */
  mul(...values: Numeric[]): Operation {
    return this._mathOp(values, MathOperation.mul);
  }

  /**
   * Divide this by others.
   * @param values Other numbers.
   */
  div(...values: Numeric[]): Operation {
    return this._mathOp(values, MathOperation.div);
  }

  /**
   * Rise the number to the given power.
   * @param other The power.
   */
  pow(other: Numeric): Operation {
    return this._mathOp([other], Math.pow);
  }

  /**
   * Negate the number.
   */
  neg(): Operation {
    return this._mathOp([], MathOperation.neg);
  }

  /**
   * Returns an implementation-dependent (browser wise) approximation to the cube root of number.
   */
  cbrt(): Operation {
    return this._mathOp([], Math.cbrt);
  }

  /**
   * Returns the square root of a number.
   */
  sqrt(): Operation {
    return this._mathOp([], Math.sqrt);
  }

  /**
   * Rise the absolute value of the given number.
   */
  abs(): Operation {
    return this._mathOp([], Math.abs);
  }

  /**
   * Return the floor of the current number.
   */
  floor(): Operation {
    return this._mathOp([], Math.floor);
  }

  /**
   * Returns the smallest integer greater than or equal to its numeric argument.
   */
  ceil(): Operation {
    return this._mathOp([], Math.ceil);
  }

  /**
   * Round the number and return the result.
   */
  round(): Operation {
    return this._mathOp([], Math.round);
  }

  /**
   * Remove the decimal points from the number.
   */
  trunc(): Operation {
    return this._mathOp([], Math.trunc);
  }

  /**
   * Return `Floor(x / other) * other`.
   */
  step(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.step);
  }

  /**
   * Return sign of the number,
   * ```
   * x < 0 => -1
   * x = 0 => 0
   * x > 0 => +1
   * ```
   */
  sign(): Operation {
    return this._mathOp([], Math.sign);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  min(...other: Numeric[]): Operation {
    return this._mathOp(other, Math.min);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  max(...other: Numeric[]): Operation {
    return this._mathOp(other, Math.max);
  }

  /**
   * Returns the sine of the current number.
   */
  sin(): Operation {
    return this._mathOp([], Math.sin);
  }

  /**
   * Returns the cosine of the current number.
   */
  cos(): Operation {
    return this._mathOp([], Math.cos);
  }

  /**
   * Returns the tangent of the current number.
   */
  tan(): Operation {
    return this._mathOp([], Math.tan);
  }

  /**
   * Returns the arcsine of the current number.
   */
  asin(): Operation {
    return this._mathOp([], Math.asin);
  }

  /**
   * Returns the arc cosine of the current number.
   */
  acos(): Operation {
    return this._mathOp([], Math.acos);
  }

  /**
   * Returns the arctangent of the current number.
   */
  atan(): Operation {
    return this._mathOp([], Math.atan);
  }

  /**
   * Returns the hyperbolic cosine of the current number.
   */
  cosh(): Operation {
    return this._mathOp([], Math.cosh);
  }

  /**
   * Returns the hyperbolic sine of the current number.
   */
  sinh(): Operation {
    return this._mathOp([], Math.sinh);
  }

  /**
   * Returns the hyperbolic tangent of the current number.
   */
  tanh(): Operation {
    return this._mathOp([], Math.tanh);
  }

  /**
   * Returns the inverse hyperbolic sine of the number.
   */
  asinh(): Operation {
    return this._mathOp([], Math.asinh);
  }

  /**
   * Returns the inverse hyperbolic cosine of the number.
   */
  acosh(): Operation {
    return this._mathOp([], Math.acosh);
  }

  /**
   * Returns the inverse hyperbolic tangent of a number.
   */
  atanh(): Operation {
    return this._mathOp([], Math.atanh);
  }

  /**
   * Returns e (the base of natural logarithms) raised to this number's power.
   */
  exp(): Operation {
    return this._mathOp([], Math.exp);
  }

  /**
   * Returns the natural logarithm (base e) of the current number.
   */
  log(): Operation {
    return this._mathOp([], Math.log);
  }

  /**
   * Returns the base 2 logarithm of the current number.
   */
  log2(): Operation {
    return this._mathOp([], Math.log2);
  }

  /**
   * Returns the base 10 logarithm of the current number.
   */
  log10(): Operation {
    return this._mathOp([], Math.log10);
  }

  /**
   * Returns the square root of the sum of squares of its this number plus the ones provided in arguments.
   *     If no arguments are passed, the result is the absolute value of current number.
   *     If any argument is +Infinity or -Infinity, the result is +Infinity.
   *     If any argument is NaN, the result is NaN.
   *     If all arguments are either +0 or −0, the result is +0.
   * @param values Values to compute the square root for.
   */
  hypot(...values: number[]): Operation {
    return this._mathOp(values, Math.hypot);
  }

  /**
   * Returns the natural logarithm of 1 + x.
   */
  log1p(): Operation {
    return this._mathOp([], Math.log1p);
  }

  /**
   * Returns the result of (e^x - 1), which is an implementation-dependent approximation to
   * subtracting 1 from the exponential function of x (e raised to the power of x, where e
   * is the base of the natural logarithms).
   */
  expm1(): Operation {
    return this._mathOp([], Math.expm1);
  }

  /**
   * Returns the result of 32-bit multiplication this number with another number.
   */
  imul(other: Numeric): Operation {
    return this._mathOp([other], Math.imul);
  }

  /**
   * Constrains the value to minimum and maximum bounds. For example, if the input value
   * is 10, the lower bound is 50, and the upper bound is 100, then 50 is returned.
   */
  constrain(min: Numeric, max: Numeric): Operation {
    return this._mathOp([min, max], MathOperation.constrain);
  }

  /**
   * Returns a given value if a the current number evaluates to true, and returns an alternate
   * value if that condition evaluates to false.
   * @param trueValue The value to return if the condition evaluates to true.
   * @param falseValue The value to return if the condition evaluates to false.
   */
  iif(trueValue: Numeric, falseValue: Numeric): Operation {
    return this._mathOp([trueValue, falseValue], MathOperation.iif);
  }

  /**
   * `defaultValue.switchCase(condition1, value1, condition2, value2, ...)`.
   * @param values Pairs of `condition` and `result`.
   */
  switchCase(...values: Numeric[]): Operation {
    assert(values.length % 2 === 0 && values.length > 0, 'Wrong number of arguments.');
    return this._mathOp(values, MathOperation.switchCase);
  }

  /**
   * Returns `1` if the current number is less than `other`, otherwise returns `0`.
   */
  lt(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is less than or equal to `other`, otherwise returns `0`.
   */
  lte(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.lte);
  }

  /**
   * Returns `1` if the current number is greater than `other`, otherwise returns `0`.
   */
  gt(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is greater than or equal to `other`, otherwise returns `0`.
   */
  gte(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.gte);
  }

  /**
   * Returns `1` if the current number is equal to `other`, otherwise returns `0`.
   */
  eq(other: Numeric): Operation {
    return this._mathOp([other], MathOperation.eq);
  }

  /**
   * Returns `1` if the current number is positive (x > 0), otherwise returns `0`.
   */
  isPos(other: Numeric): Operation {
    return this._mathOp([0], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is negative (x < 0), otherwise returns `0`.
   */
  isNeg(other: Numeric): Operation {
    return this._mathOp([0], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is equal to `0`, otherwise returns `0`.
   */
  isZero(other: Numeric): Operation {
    return this._mathOp([0], MathOperation.eq);
  }

  /**
   * Negate the number as a boolean, if the number is truthy the value `0` is returned
   * otherwise `1` is returned.
   */
  not(): Operation {
    return this._mathOp([], MathOperation.not);
  }

  /**
   * Perform a logical `and` operation, the result is `1` or `0`.
   * @param other Other numbers.
   */
  and(...other: Numeric[]): Operation {
    return this._mathOp(other, MathOperation.and);
  }

  /**
   * Perform a logical `or` operation, the result is `1` or `0`.
   * @param other Other numbers.
   */
  or(...other: Numeric[]): Operation {
    return this._mathOp(other, MathOperation.or);
  }

  /**
   * Access point for technical analysis indicators.
   */
  get ta(): NumericIndicators {
    return new NumericIndicators(this);
  }
}

export class Candle extends Operation {
  readonly open = new CandlePick('open');
  readonly high = new CandlePick('high');
  readonly low = new CandlePick('low');
  readonly close = new CandlePick('close');
  readonly volume = new CandlePick('volume');

  protected _mathOp(values: Numeric[], fn: (...args: number[]) => number) {
    // When doing math on candlesticks use the closing price by default.
    return new MathOperation([this.close, ...values.map(toOperation)], fn);
  }

  get ta(): CandleStickIndicators {
    return new CandleStickIndicators(this);
  }

  predecessors() {
    return [];
  }

  next(ctx: ExecutionContext) {
    this._data = ctx.$;
  }
}

export class CandlePick<T extends keyof DataPoint> extends Operation {
  constructor(readonly key: T) {
    super();
  }

  predecessors() {
    return [];
  }

  next(ctx: ExecutionContext) {
    this._data = ctx.$[this.key];
  }
}

export class Primitive extends Operation {
  constructor(data: number) {
    super();
    this._data = data;
  }

  predecessors() {
    return [];
  }

  next() {}
}

/**
 * @internal
 */
export class MathOperation extends Operation {
  constructor(
    readonly operands: ReadonlyArray<Operation>,
    readonly fn: (...numbers: number[]) => number
  ) {
    super();
    // TODO(qti3e) If all the operands are primitives, perform the operation.
  }

  predecessors() {
    return this.operands.slice(0);
  }

  next() {
    this._data = this.fn(...this.operands.map((node) => node._data));
  }

  static add(...numbers: number[]) {
    let sum = 0;
    for (let i = 0, n = numbers.length; i < n; ++i) sum += numbers[i];
    return sum;
  }

  static sub(...numbers: number[]) {
    let result = numbers[0];
    for (let i = 1, n = numbers.length; i < n; ++i) result -= numbers[i];
    return result;
  }

  static mul(...numbers: number[]) {
    let result = numbers[0];
    for (let i = 1, n = numbers.length; i < n; ++i) result *= numbers[i];
    return result;
  }

  static div(...numbers: number[]) {
    let result = numbers[0];
    for (let i = 1, n = numbers.length; i < n; ++i) result /= numbers[i];
    return result;
  }

  static step(x: number, y: number) {
    return Math.trunc(x / y) * y;
  }

  static neg(n: number) {
    return -n;
  }

  static lt(x: number, y: number) {
    return x < y ? 1 : 0;
  }

  static lte(x: number, y: number) {
    return x <= y ? 1 : 0;
  }

  static gt(x: number, y: number) {
    return x > y ? 1 : 0;
  }

  static gte(x: number, y: number) {
    return x >= y ? 1 : 0;
  }

  static eq(x: number, y: number) {
    return x === y ? 1 : 0;
  }

  static and(...numbers: number[]) {
    let result = true;
    for (let i = 0, n = numbers.length; result && i < n; ++i) result = !!numbers[i];
    return result ? 1 : 0;
  }

  static or(...numbers: number[]) {
    let result = false;
    for (let i = 0, n = numbers.length; !result && i < n; ++i) result = !!numbers[i];
    return result ? 1 : 0;
  }

  static not(n: number) {
    return n ? 0 : 1;
  }

  static constrain(value: number, min: number, max: number) {
    if (min > max) return MathOperation.constrain(value, max, min);
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  static iif(condition: number, trueValue: number, falseValue: number) {
    return condition ? trueValue : falseValue;
  }

  static switchCase(defaultValue: number, ...cases: number[]) {
    for (let i = 0, n = cases.length; i < n; i += 2) if (cases[i]) return cases[i + 1];
    return defaultValue;
  }
}

export class IndicatorOperation extends Operation {
  constructor(readonly source: Operation, readonly indicator: indicators.Indicator) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    this.source._data = this.indicator.next(this.source._data);
  }
}

export class NumericIndicators {
  constructor(protected readonly source: Operation, protected readonly numericSource = source) {}

  /**
   * The range of a day's trading is simply _high_ - _low_.
   * The true range extends it to yesterday's closing price if it was outside of today's range.
   *
   * The true range is the largest of one the following:
   *
   * * Most recent period's high minus the most recent period's low
   * * Absolute value of the most recent period's high minus the previous close
   * * Absolute value of the most recent period's low minus the previous close
   *
   * # Formula
   *
   * TR = max[(high - low), abs(high - close<sub>prev</sub>), abs(low - close<sub>prev</sub>)]
   */
  true_range(): IndicatorOperation {
    return new IndicatorOperation(this.source, new indicators.TrueRange());
  }

  /**
   * Simple moving average (SMA).
   *
   * # Formula
   *
   * ![SMA](https://wikimedia.org/api/rest_v1/media/math/render/svg/e2bf09dc6deaf86b3607040585fac6078f9c7c89)
   *
   * Where:
   *
   * * _SMA<sub>t</sub>_ - value of simple moving average at a point of time _t_
   * * _period_ - number of periods (period)
   * * _p<sub>t</sub>_ - input value at a point of time _t_
   *
   * @param period number of periods (integer greater than 0)
   */
  simple_moving_average(period: number): IndicatorOperation {
    return new IndicatorOperation(this.numericSource, new indicators.SimpleMovingAverage(period));
  }
}

/**
 * Indicators that require the entire data of a candle stick.
 */
export class CandleStickIndicators extends NumericIndicators {
  constructor(source: Candle) {
    super(source, source.close);
  }

  /**
   * The range of a day's trading which is simply _high_ - _low_.
   */
  range(): IndicatorOperation {
    return new IndicatorOperation(this.source, new indicators.Range());
  }
}

function toOperation(n: Numeric) {
  if (typeof n === 'number') return new Primitive(n);
  return n;
}

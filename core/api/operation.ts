import * as indicators from '../indicators';
import { assert } from '../util';
import { DataPoint } from '../indicators/interface';
import { ComputationNode, ExecutionContext } from './nodes';

export type MathOperand = number | ComputationNode<number> | Candle;

export type NumericOperation<I = unknown> = Operation<number, I>;

export abstract class Operation<O, I = unknown> extends ComputationNode<O, I> {
  /**
   * Add multiple numbers to the result of this value and return the new value.
   * @param values Primitive numbers or computational units to add.
   */
  add(...values: MathOperand[]): NumericOperation {
    return this._mathOp(values, MathOperation.add);
  }

  /**
   * Subtract the given numbers from this node.
   * @param values Other numbers.
   */
  sub(...values: MathOperand[]): NumericOperation {
    return this._mathOp(values, MathOperation.sub);
  }

  /**
   * Multiply this and other numbers together.
   * @param values Other numbers.
   */
  mul(...values: MathOperand[]): NumericOperation {
    return this._mathOp(values, MathOperation.mul);
  }

  /**
   * Divide this by others.
   *
   * # Example
   * ```js
   * const SMA20 = $.ta.sma(20);
   * const High20 = $.ta.high(20);
   * const HighAvgRation = High20.div(SMA20);
   * ```
   * @param values Other numbers.
   */
  div(...values: MathOperand[]): NumericOperation {
    return this._mathOp(values, MathOperation.div);
  }

  /**
   * Rise the number to the given power.
   * @param other The power.
   */
  pow(other: MathOperand): NumericOperation {
    return this._mathOp([other], Math.pow);
  }

  /**
   * Negate the number.
   */
  neg(): NumericOperation {
    return this._mathOp([], MathOperation.neg);
  }

  /**
   * Returns an implementation-dependent (browser wise) approximation to the cube root of number.
   */
  cbrt(): NumericOperation {
    return this._mathOp([], Math.cbrt);
  }

  /**
   * Returns the square root of a number.
   */
  sqrt(): NumericOperation {
    return this._mathOp([], Math.sqrt);
  }

  /**
   * Rise the absolute value of the given number.
   */
  abs(): NumericOperation {
    return this._mathOp([], Math.abs);
  }

  /**
   * Return the floor of the current number.
   */
  floor(): NumericOperation {
    return this._mathOp([], Math.floor);
  }

  /**
   * Returns the smallest integer greater than or equal to its numeric argument.
   */
  ceil(): NumericOperation {
    return this._mathOp([], Math.ceil);
  }

  /**
   * Round the number and return the result.
   */
  round(): NumericOperation {
    return this._mathOp([], Math.round);
  }

  /**
   * Remove the decimal points from the number.
   */
  trunc(): NumericOperation {
    return this._mathOp([], Math.trunc);
  }

  /**
   * Return `Floor(x / other) * other`.
   */
  step(other: MathOperand): NumericOperation {
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
  sign(): NumericOperation {
    return this._mathOp([], Math.sign);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  min(...other: MathOperand[]): NumericOperation {
    return this._mathOp(other, Math.min);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  max(...other: MathOperand[]): NumericOperation {
    return this._mathOp(other, Math.max);
  }

  /**
   * Returns the sine of the current number.
   */
  sin(): NumericOperation {
    return this._mathOp([], Math.sin);
  }

  /**
   * Returns the cosine of the current number.
   */
  cos(): NumericOperation {
    return this._mathOp([], Math.cos);
  }

  /**
   * Returns the tangent of the current number.
   */
  tan(): NumericOperation {
    return this._mathOp([], Math.tan);
  }

  /**
   * Returns the arcsine of the current number.
   */
  asin(): NumericOperation {
    return this._mathOp([], Math.asin);
  }

  /**
   * Returns the arc cosine of the current number.
   */
  acos(): NumericOperation {
    return this._mathOp([], Math.acos);
  }

  /**
   * Returns the arctangent of the current number.
   */
  atan(): NumericOperation {
    return this._mathOp([], Math.atan);
  }

  /**
   * Returns the hyperbolic cosine of the current number.
   */
  cosh(): NumericOperation {
    return this._mathOp([], Math.cosh);
  }

  /**
   * Returns the hyperbolic sine of the current number.
   */
  sinh(): NumericOperation {
    return this._mathOp([], Math.sinh);
  }

  /**
   * Returns the hyperbolic tangent of the current number.
   */
  tanh(): NumericOperation {
    return this._mathOp([], Math.tanh);
  }

  /**
   * Returns the inverse hyperbolic sine of the number.
   */
  asinh(): NumericOperation {
    return this._mathOp([], Math.asinh);
  }

  /**
   * Returns the inverse hyperbolic cosine of the number.
   */
  acosh(): NumericOperation {
    return this._mathOp([], Math.acosh);
  }

  /**
   * Returns the inverse hyperbolic tangent of a number.
   */
  atanh(): NumericOperation {
    return this._mathOp([], Math.atanh);
  }

  /**
   * Returns e (the base of natural logarithms) raised to this number's power.
   */
  exp(): NumericOperation {
    return this._mathOp([], Math.exp);
  }

  /**
   * Returns the natural logarithm (base e) of the current number.
   */
  log(): NumericOperation {
    return this._mathOp([], Math.log);
  }

  /**
   * Returns the base 2 logarithm of the current number.
   */
  log2(): NumericOperation {
    return this._mathOp([], Math.log2);
  }

  /**
   * Returns the base 10 logarithm of the current number.
   */
  log10(): NumericOperation {
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
  hypot(...values: number[]): NumericOperation {
    return this._mathOp(values, Math.hypot);
  }

  /**
   * Returns the natural logarithm of 1 + x.
   */
  log1p(): NumericOperation {
    return this._mathOp([], Math.log1p);
  }

  /**
   * Returns the result of (e^x - 1), which is an implementation-dependent approximation to
   * subtracting 1 from the exponential function of x (e raised to the power of x, where e
   * is the base of the natural logarithms).
   */
  expm1(): NumericOperation {
    return this._mathOp([], Math.expm1);
  }

  /**
   * Returns the result of 32-bit multiplication this number with another number.
   */
  imul(other: MathOperand): NumericOperation {
    return this._mathOp([other], Math.imul);
  }

  /**
   * Constrains the value to minimum and maximum bounds. For example, if the input value
   * is 10, the lower bound is 50, and the upper bound is 100, then 50 is returned.
   */
  constrain(min: MathOperand, max: MathOperand): NumericOperation {
    return this._mathOp([min, max], MathOperation.constrain);
  }

  /**
   * Returns a given value if a the current number evaluates to true, and returns an alternate
   * value if that condition evaluates to false.
   * @param trueValue The value to return if the condition evaluates to true.
   * @param falseValue The value to return if the condition evaluates to false.
   */
  iif(trueValue: MathOperand, falseValue: MathOperand): NumericOperation {
    return this._mathOp([trueValue, falseValue], MathOperation.iif);
  }

  /**
   * `defaultValue.switchCase(condition1, value1, condition2, value2, ...)`.
   * @param values Pairs of `condition` and `result`.
   */
  switchCase(...values: MathOperand[]): NumericOperation {
    assert(values.length % 2 === 0 && values.length > 0, 'Wrong number of arguments.');
    return this._mathOp(values, MathOperation.switchCase);
  }

  /**
   * Returns `1` if the current number is less than `other`, otherwise returns `0`.
   */
  lt(other: MathOperand): NumericOperation {
    return this._mathOp([other], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is less than or equal to `other`, otherwise returns `0`.
   */
  lte(other: MathOperand): NumericOperation {
    return this._mathOp([other], MathOperation.lte);
  }

  /**
   * Returns `1` if the current number is greater than `other`, otherwise returns `0`.
   */
  gt(other: MathOperand): NumericOperation {
    return this._mathOp([other], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is greater than or equal to `other`, otherwise returns `0`.
   */
  gte(other: MathOperand): NumericOperation {
    return this._mathOp([other], MathOperation.gte);
  }

  /**
   * Returns `1` if the current number is equal to `other`, otherwise returns `0`.
   */
  eq(other: MathOperand): NumericOperation {
    return this._mathOp([other], MathOperation.eq);
  }

  /**
   * Returns `1` if the current number is positive (x > 0), otherwise returns `0`.
   */
  isPos(other: MathOperand): NumericOperation {
    return this._mathOp([0], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is negative (x < 0), otherwise returns `0`.
   */
  isNeg(other: MathOperand): NumericOperation {
    return this._mathOp([0], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is equal to `0`, otherwise returns `0`.
   */
  isZero(other: MathOperand): NumericOperation {
    return this._mathOp([0], MathOperation.eq);
  }

  /**
   * Negate the number as a boolean, if the number is truthy the value `0` is returned
   * otherwise `1` is returned.
   */
  not(): NumericOperation {
    return this._mathOp([], MathOperation.not);
  }

  /**
   * Perform a logical `and` operation, the result is `1` or `0`.
   * @param other Other numbers.
   */
  and(...other: MathOperand[]): NumericOperation {
    return this._mathOp(other, MathOperation.and);
  }

  /**
   * Perform a logical `or` operation, the result is `1` or `0`.
   * @param other Other numbers.
   */
  or(...other: MathOperand[]): NumericOperation {
    return this._mathOp(other, MathOperation.or);
  }

  /** @internal */
  abstract toNumeric(): NumericOperation;

  protected _mathOp(values: MathOperand[], fn: (...args: number[]) => number) {
    return new MathOperation([this.toNumeric(), ...values.map(fromMathOperand)], fn);
  }

  /**
   * Access point for technical analysis indicators.
   */
  get ta(): NumericIndicators {
    return new NumericIndicators(this.toNumeric(), this.toNumeric());
  }
}

export class Candle extends Operation<DataPoint, never> {
  readonly open = new CandlePick('open');
  readonly high = new CandlePick('high');
  readonly low = new CandlePick('low');
  readonly close = new CandlePick('close');
  readonly volume = new CandlePick('volume');

  protected _mathOp(values: MathOperand[], fn: (...args: number[]) => number) {
    // When doing math on candlesticks use the closing price by default.
    return new MathOperation([this.close, ...values.map(fromMathOperand)], fn);
  }

  /**
   * Access point for technical analysis indicators.
   */
  get ta(): CandleStickIndicators {
    return new CandleStickIndicators(this);
  }

  predecessors() {
    return [];
  }

  next(ctx: ExecutionContext) {
    this._data = ctx.$;
  }

  toNumeric() {
    return this.close;
  }
}

export class CandlePick<T extends keyof DataPoint> extends Operation<DataPoint[T], never> {
  constructor(readonly key: T) {
    super();
  }

  predecessors() {
    return [];
  }

  next(ctx: ExecutionContext) {
    this._data = ctx.$[this.key];
  }

  toNumeric() {
    return this;
  }
}

export class Primitive extends Operation<number, never> {
  constructor(data: number) {
    super();
    this._data = data;
  }

  predecessors() {
    return [];
  }

  next() {}

  toNumeric() {
    return this;
  }
}

/**
 * @internal
 */
export class MathOperation<I> extends Operation<number, I> {
  constructor(
    readonly operands: ReadonlyArray<ComputationNode<I>>,
    readonly fn: (...inputs: I[]) => number
  ) {
    super();
    // TODO(qti3e) If all the operands are primitives, perform the operation.
  }

  predecessors() {
    return this.operands.slice(0);
  }

  next() {
    const len = this.operands.length;
    const operands: I[] = Array(len);
    for (let i = 0; i < len; ++i) {
      const data = this.operands[i]._data;
      // Possibly a delayed node (e.g SMA).
      if (data === null) {
        this._data = null;
        return;
      }
      operands.push(data as I);
    }
    this._data = this.fn(...operands);
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

  toNumeric() {
    return this;
  }
}

export class IndicatorOperation<O, I extends DataPoint | number> extends Operation<O, I> {
  constructor(readonly source: Operation<I>, readonly indicator: indicators.Indicator<I, O>) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    const data = this.source._data as I;
    this._data = data === null ? null : this.indicator.next(data);
  }

  toNumeric() {
    // TODO(qti3e)
    return this as any;
  }
}

export class NumericIndicators<
  T extends Operation<DataPoint | number> = Operation<DataPoint | number>
> {
  constructor(protected readonly source: T, protected readonly numericSource: Operation<number>) {}

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
  true_range(): IndicatorOperation<number, DataPoint | number> {
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
  simple_moving_average(period: number): IndicatorOperation<number | null, number | DataPoint> {
    return new IndicatorOperation(this.numericSource, new indicators.SimpleMovingAverage(period));
  }
}

/**
 * Indicators that require the entire data of a candle stick.
 */
export class CandleStickIndicators extends NumericIndicators<Candle> {
  constructor(source: Candle) {
    super(source, source.close);
  }

  /**
   * The range of a day's trading which is simply _high_ - _low_.
   */
  range(): IndicatorOperation<number, DataPoint> {
    return new IndicatorOperation(this.source, new indicators.Range());
  }
}

function fromMathOperand(n: MathOperand): ComputationNode<number> {
  if (typeof n === 'number') return new Primitive(n);
  if (n instanceof Candle) return n.close;
  return n;
}

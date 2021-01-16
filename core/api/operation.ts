export type Numeric = number | Operation;

export abstract class Operation {
  /**
   * Add multiple numbers to the result of this value and return the new value.
   * @param other Primitive numbers or computational units to add.
   */
  add(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], MathOperation.add);
  }

  /**
   * Subtract the given numbers from this node.
   * @param other Other numbers.
   */
  sub(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], MathOperation.sub);
  }

  /**
   * Multiply this and other numbers together.
   * @param other Other numbers.
   */
  mul(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], MathOperation.mul);
  }

  /**
   * Divide this by others.
   * @param other Other numbers.
   */
  div(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], MathOperation.div);
  }

  /**
   * Rise the number to the given power.
   * @param other The power.
   */
  pow(other: Numeric): Operation {
    return new MathOperation([this, other], Math.pow);
  }

  /**
   * Negate the number.
   */
  neg(): Operation {
    return new MathOperation([this], MathOperation.neg);
  }

  /**
   * Returns an implementation-dependent approximation to the cube root of number.
   */
  cbrt(): Operation {
    return new MathOperation([this], Math.cbrt);
  }

  /**
   * Returns the square root of a number.
   */
  sqrt(): Operation {
    return new MathOperation([this], Math.sqrt);
  }

  /**
   * Rise the absolute value of the given number.
   */
  abs(): Operation {
    return new MathOperation([this], Math.abs);
  }

  /**
   * Return the floor of the current number.
   */
  floor(): Operation {
    return new MathOperation([this], Math.floor);
  }

  /**
   * Returns the smallest integer greater than or equal to its numeric argument.
   */
  ceil(): Operation {
    return new MathOperation([this], Math.ceil);
  }

  /**
   * Round the number and return the result.
   */
  round(): Operation {
    return new MathOperation([this], Math.round);
  }

  /**
   * Remove the decimal points from the number.
   */
  trunc(): Operation {
    return new MathOperation([this], Math.trunc);
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
    return new MathOperation([this], Math.sign);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  min(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], Math.min);
  }

  /**
   * Return the smallest number between self and others.
   * @param other Other numbers.
   */
  max(...other: Numeric[]): Operation {
    return new MathOperation([this, ...other], Math.max);
  }

  /**
   * Returns the sine of the current number.
   */
  sin(): Operation {
    return new MathOperation([this], Math.sin);
  }

  /**
   * Returns the cosine of the current number.
   */
  cos(): Operation {
    return new MathOperation([this], Math.cos);
  }

  /**
   * Returns the tangent of the current number.
   */
  tan(): Operation {
    return new MathOperation([this], Math.tan);
  }

  /**
   * Returns the arcsine of the current number.
   */
  asin(): Operation {
    return new MathOperation([this], Math.asin);
  }

  /**
   * Returns the arc cosine of the current number.
   */
  acos(): Operation {
    return new MathOperation([this], Math.acos);
  }

  /**
   * Returns the arctangent of the current number.
   */
  atan(): Operation {
    return new MathOperation([this], Math.atan);
  }

  /**
   * Returns the hyperbolic cosine of the current number.
   */
  cosh(): Operation {
    return new MathOperation([this], Math.cosh);
  }

  /**
   * Returns the hyperbolic sine of the current number.
   */
  sinh(): Operation {
    return new MathOperation([this], Math.sinh);
  }

  /**
   * Returns the hyperbolic tangent of the current number.
   */
  tanh(): Operation {
    return new MathOperation([this], Math.tanh);
  }

  /**
   * Returns the inverse hyperbolic sine of the number.
   */
  asinh(): Operation {
    return new MathOperation([this], Math.asinh);
  }

  /**
   * Returns the inverse hyperbolic cosine of the number.
   */
  acosh(): Operation {
    return new MathOperation([this], Math.acosh);
  }

  /**
   * Returns the inverse hyperbolic tangent of a number.
   */
  atanh(): Operation {
    return new MathOperation([this], Math.atanh);
  }

  /**
   * Returns e (the base of natural logarithms) raised to this number's power.
   */
  exp(): Operation {
    return new MathOperation([this], Math.exp);
  }

  /**
   * Returns the natural logarithm (base e) of the current number.
   */
  log(): Operation {
    return new MathOperation([this], Math.log);
  }

  /**
   * Returns the base 2 logarithm of the current number.
   */
  log2(): Operation {
    return new MathOperation([this], Math.log2);
  }

  /**
   * Returns the base 10 logarithm of the current number.
   */
  log10(): Operation {
    return new MathOperation([this], Math.log10);
  }

  /**
   * Returns the square root of the sum of squares of its this number plus the ones provided in arguments.
   *     If no arguments are passed, the result is +0.
   *     If there is only one argument, the result is the absolute value.
   *     If any argument is +Infinity or -Infinity, the result is +Infinity.
   *     If any argument is NaN, the result is NaN.
   *     If all arguments are either +0 or −0, the result is +0.
   * @param values Values to compute the square root for.
   */
  hypot(...values: number[]): Operation {
    return new MathOperation([this, ...values], Math.hypot);
  }

  /**
   * Returns the natural logarithm of 1 + x.
   */
  log1p(): Operation {
    return new MathOperation([this], Math.log1p);
  }

  /**
   * Returns the result of (e^x - 1), which is an implementation-dependent approximation to
   * subtracting 1 from the exponential function of x (e raised to the power of x, where e
   * is the base of the natural logarithms).
   */
  expm1(): Operation {
    return new MathOperation([this], Math.expm1);
  }

  /**
   * Returns the result of 32-bit multiplication this number with another number.
   */
  imul(other: Numeric): Operation {
    return new MathOperation([this, other], Math.imul);
  }

  /**
   * Constrains the value to minimum and maximum bounds. For example, if the input value
   * is 10, the lower bound is 50, and the upper bound is 100, then 50 is returned.
   */
  constrain(min: Numeric, max: Numeric): Operation {
    return new MathOperation([this, min, max], MathOperation.constrain);
  }

  /**
   * Returns a given value if a the current number evaluates to true, and returns an alternate
   * value if that condition evaluates to false.
   * @param trueValue The value to return if the condition evaluates to true.
   * @param falseValue The value to return if the condition evaluates to false.
   */
  iif(trueValue: Numeric, falseValue: Numeric): Operation {
    return new MathOperation([this, trueValue, falseValue], MathOperation.iif);
  }

  /**
   * Returns `1` if the current number is less than `other`, otherwise returns `0`.
   */
  lt(other: Numeric): Operation {
    return new MathOperation([this, other], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is less than or equal to `other`, otherwise returns `0`.
   */
  lte(other: Numeric): Operation {
    return new MathOperation([this, other], MathOperation.lte);
  }

  /**
   * Returns `1` if the current number is greater than `other`, otherwise returns `0`.
   */
  gt(other: Numeric): Operation {
    return new MathOperation([this, other], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is greater than or equal to `other`, otherwise returns `0`.
   */
  gte(other: Numeric): Operation {
    return new MathOperation([this, other], MathOperation.gte);
  }

  /**
   * Returns `1` if the current number is equal to `other`, otherwise returns `0`.
   */
  eq(other: Numeric): Operation {
    return new MathOperation([this, other], MathOperation.eq);
  }

  /**
   * Returns `1` if the current number is positive to `other`, otherwise returns `0`.
   */
  isPos(other: Numeric): Operation {
    return new MathOperation([this, 0], MathOperation.gt);
  }

  /**
   * Returns `1` if the current number is positive to `other`, otherwise returns `0`.
   */
  isNeg(other: Numeric): Operation {
    return new MathOperation([this, 0], MathOperation.lt);
  }

  /**
   * Returns `1` if the current number is positive to `other`, otherwise returns `0`.
   */
  isZero(other: Numeric): Operation {
    return new MathOperation([this, 0], MathOperation.eq);
  }
}

export class Primitive extends Operation {
  constructor(readonly data: number) {
    super();
  }
}

export class MathOperation extends Operation {
  constructor(
    readonly children: ReadonlyArray<Numeric>,
    readonly fn: (...numbers: number[]) => number
  ) {
    super();
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

  static constrain(value: number, min: number, max: number) {
    if (min > max) return MathOperation.constrain(value, max, min);
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  static iif(condition: number, trueValue: number, falseValue: number) {
    return condition ? trueValue : falseValue;
  }
}

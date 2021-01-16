import * as indicators from '../indicators';

export class Flow {
  /**
   * @internal
   */
  static root = new Flow([]);

  private constructor(private flow: indicators.Indicator[]) {}

  /**
   * Pass the current value to another indicator.
   * This is an advanced functionality, only use it when you know what you're doing.
   * @param indicator The indicator to use.
   */
  pipe(indicator: indicators.Indicator): Flow {
    return new Flow([...this.flow, indicator]);
  }

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
  true_range(): Flow {
    return this.pipe(new indicators.TrueRange())
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
  simple_moving_average(period: number): Flow {
    return this.pipe(new indicators.SimpleMovingAverage(period))
  }
}

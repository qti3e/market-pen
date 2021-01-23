import {
  ComputationNode,
  WatchNode,
  WatchCB,
  WatchChangeNode,
  PlotFunction,
  PlotFunctionNode,
  PlotNode,
} from '../api/nodes';
import { Candle, Primitive } from '../api/operation';
import { Compiler } from './compiler';
import { DataPoint } from '../indicators/interface';
import { Indicator } from './view';

export type PlotSource = PlotFunction | ComputationNode<number | null>;

export interface IndicatorOptions {
  type: 'bar' | 'line';
  domain: [number, number];
}

export function generateGlobalContext(compiler: Compiler) {
  // ***  $  **************************************************************
  function $(arg: number | ((data: DataPoint, isFinal: boolean) => void)) {
    if (typeof arg === 'function') return void compiler.pin(new WatchNode($ as any, arg));
    return new Primitive(Number(arg));
  }
  $.__proto__ = Candle.prototype;
  Object.assign($, new Candle());

  // ***  watch  **********************************************************
  function watch<T>(node: ComputationNode<T>, cb: WatchCB<T>, skipFirst: boolean = false): void {
    compiler.pin(new WatchChangeNode(node, cb, skipFirst));
  }

  watch.always = function watch<T>(node: ComputationNode<T>, cb: WatchCB<T>): void {
    compiler.pin(new WatchNode(node, cb));
  };

  // ***  pin  ************************************************************
  function pin(node: ComputationNode<any>) {
    compiler.pin(node as any);
    return node;
  }

  // ***  plot  ***********************************************************
  function plot(
    title: string,
    source: PlotSource,
    type: 'line' | 'point' | 'bar' | 'step' = 'line',
    color?: string
  ): void {
    let index: number;
    if (typeof source === 'function') {
      index = compiler.addSeries({});
      compiler.pin(new PlotFunctionNode(index, source));
    } else {
      index = compiler.addSeries(source);
      compiler.pin(new PlotNode(index, source));
    }
    compiler.view.plots.push({
      title,
      type,
      seriesIndex: index,
      color,
    });
  }

  // ***  indicator  ******************************************************
  function indicator(title: string, source: PlotSource, options?: Partial<IndicatorOptions>) {
    let index: number;
    if (typeof source === 'function') {
      index = compiler.addSeries({});
      compiler.pin(new PlotFunctionNode(index, source));
    } else {
      index = compiler.addSeries(source);
      compiler.pin(new PlotNode(index, source));
    }

    const chart: Indicator = {
      type: 'bar',
      domain: [-100, 100],
      ...options,
      title,
      seriesIndex: index,
      plots: [],
    };

    function plot(
      title: string,
      source: PlotSource,
      type: 'line' | 'point' | 'bar' | 'step' = 'line',
      color?: string
    ): void {
      let index: number;
      if (typeof source === 'function') {
        index = compiler.addSeries({});
        compiler.pin(new PlotFunctionNode(index, source));
      } else {
        index = compiler.addSeries(source);
        compiler.pin(new PlotNode(index, source));
      }
      chart.plots.push({
        title,
        type,
        seriesIndex: index,
        color,
      });
    }

    const result = {
      line(title: string, source: PlotSource, color?: string) {
        plot(title, source, 'line', color);
        return result;
      },
      bar(title: string, source: PlotSource, color?: string) {
        plot(title, source, 'bar', color);
        return result;
      },
      step(title: string, source: PlotSource, color?: string) {
        plot(title, source, 'step', color);
        return result;
      },
      point(title: string, source: PlotSource, color?: string) {
        plot(title, source, 'point', color);
        return result;
      },
      asLine() {
        chart.type = 'line';
        return result;
      },
    };

    compiler.view.indicators.push(chart);
    return result;
  }

  return {
    $,
    watch,
    pin,
    plot,
    indicator,
  };
}

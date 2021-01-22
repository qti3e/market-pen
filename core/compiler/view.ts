export interface View {
  plots: Plot[];
  indicators: Indicator[];
}

export interface Indicator {
  title: string;
  type: 'line' | 'bar';
  seriesIndex: number;
  domain: [number, number];
  plots: Plot[];
}

export interface Plot {
  title: string;
  type: 'line' | 'point' | 'bar' | 'step';
  seriesIndex: number;
  color?: string;
}

import { RPC, WindowRPC } from './rpc';
import { compile, formatException } from './compiler/compiler';
import { ChartData, ExecResult } from './experiment';
import { Program } from './compiler/program';
import { View } from './compiler/view';
import { DataPoint } from './indicators/interface';

const channelId = document.querySelector('meta[name=rpc-channel-id]').getAttribute('content');
const rpc: RPC = new WindowRPC(window.parent, channelId);

rpc.start({
  setData,
  compileProgram,
  execute,
});

let sourceCode: string;
let program: Program;
let data: DataPoint[] = [];
let executed = false;

async function compileProgram(code: string): Promise<View> {
  program = await compile(code);
  sourceCode = code;
  executed = false;
  return program.view;
}

async function setData(chartData: ChartData): Promise<void> {
  if (program && executed) {
    executed = false;
    program = await compile(sourceCode);
    // TODO(qti3e) Implement `program.reset()`.
  }

  data = chartData.map((d) => ({
    open: d[0],
    high: d[1],
    low: d[2],
    close: d[3],
    volume: d[4],
  }));
}

async function execute(source: string): Promise<ExecResult> {
  executed = true;
  const count = program.numSeries;
  const series: number[][] = Array(count)
    .fill(null)
    .map((_) => []);
  for (let i = 0, n = data.length; i < n; ++i) {
    const res = program.next(data[i]);
    for (let j = 0; j < count; ++j) series[j].push(res.series[j]);
  }
  return { series };
}

window.addEventListener('error', (ev: ErrorEvent) => {
  let message: string;
  if (ev.error != null) {
    message = formatException(ev.error);
  } else {
    message = ev.message;
  }
  rpc.call('error', message);
});

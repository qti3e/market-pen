import { Transpiler } from './compiler/transpiler';
import { RPC, WindowRPC } from './rpc';

const transpiler = new Transpiler([]);
const channelId = document.querySelector('meta[name=rpc-channel-id]').getAttribute('content');

const rpc: RPC = new WindowRPC(window.parent, channelId);

rpc.start({
  execute,
});

async function execute(source: string): Promise<void> {}

window.addEventListener('error', (ev: ErrorEvent) => {
  let message: string;
  if (ev.error != null) {
    message = transpiler.formatException(ev.error);
  } else {
    message = ev.message;
  }
  rpc.call('error', message);
});

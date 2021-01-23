# Market Lab
Technical Analysis in JavaScript.

This is the source-code for [MarketLab](https://marketlab.web.app), a website where people can create & share (JS) scripts to analyze OHLCV charts.

# Runtime

Each script is executed only once to generate the computation graph, after that the data of each candle
is fed to that graph to generate the output for that candle.

The complete documentation of the runtime can be found in [this deno doc](https://doc.deno.land/https/marketlab.web.app/sandbox/lib.d.ts) page.

<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let outer: HTMLElement;
  let element: SVGSVGElement;
  let resizeTimer: number;
  let destroyed = false;
  let prevWidth = -1;
  let prevHeight = -1;
  let resizeFn: (w: number, h: number) => void;

  interface DataPoint {
    Date: Date;
    Open: string;
    High: string;
    Low: string;
    Close: string;
  }

  async function drawChart() {
    const prices: DataPoint[] = (await d3.csv('/FTSE.csv')) as any;
    const months = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec',
    };

    var dateFormat = d3.timeParse('%Y-%m-%d');
    for (var i = 0; i < prices.length; i++) {
      prices[i]['Date'] = dateFormat(prices[i]['Date'] as any);
    }

    const margin = { top: 15, right: 15, bottom: 65, left: 45 };
    let w = prevWidth - margin.left - margin.right;
    let h = prevHeight - margin.top - margin.bottom;

    const svg = d3
      .select(element)
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const dates = prices.map((price) => price['Date']);

    const xScale = d3.scaleLinear().domain([-1, dates.length]).range([0, w]);
    const xDateScale = d3
      .scaleQuantize()
      .domain([0, dates.length])
      .range(dates as any);
    const xBand = d3
      .scaleBand()
      .domain(d3.range(-1, dates.length) as any)
      .range([0, w])
      .padding(0.3);

    const xAxis = d3.axisBottom(xScale).tickFormat(function (i) {
      const d = dates[i as number];
      let hours = d.getHours();
      let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      let amPM = hours < 13 ? 'am' : 'pm';
      return (
        hours +
        ':' +
        minutes +
        amPM +
        ' ' +
        d.getDate() +
        ' ' +
        months[d.getMonth()] +
        ' ' +
        d.getFullYear()
      );
    });

    const rect = svg
      .append('rect')
      .attr('id', 'rect')
      .attr('width', w)
      .attr('height', h)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('clip-path', 'url(#clip)');

    const gX = svg
      .append('g')
      .attr('class', 'axis x-axis') //Assign "axis" class
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis);

    gX.selectAll('.tick text').call(wrap, xBand.bandwidth());

    const ymin = +d3.min(prices.map((r) => r.Low));
    const ymax = +d3.max(prices.map((r) => r.High));
    const yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
    const yAxis = d3.axisLeft(yScale);

    const gY = svg.append('g').attr('class', 'axis y-axis').call(yAxis);
    const chartBody = svg.append('g').attr('class', 'chartBody').attr('clip-path', 'url(#clip)');

    // draw rectangles
    const candles = chartBody
      .selectAll('.candle')
      .data(prices)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i) - xBand.bandwidth())
      .attr('class', 'candle')
      .attr('y', (d) => yScale(Math.max(+d.Open, +d.Close)))
      .attr('width', xBand.bandwidth())
      .attr('height', (d) =>
        d.Open === d.Close
          ? 1
          : yScale(Math.min(+d.Open, +d.Close)) - yScale(Math.max(+d.Open, +d.Close))
      )
      .attr('fill', (d) => (d.Open === d.Close ? 'silver' : d.Open > d.Close ? 'red' : 'green'));

    // draw high and low
    const stems = chartBody
      .selectAll('g.line')
      .data(prices)
      .enter()
      .append('line')
      .attr('class', 'stem')
      .attr('x1', (_, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr('x2', (_, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr('y1', (d) => yScale(+d.High))
      .attr('y2', (d) => yScale(+d.Low))
      .attr('stroke', (d) => (d.Open === d.Close ? 'white' : d.Open > d.Close ? 'red' : 'green'));

    const defs = svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', w)
      .attr('height', h);

    let extent: [[number, number], [number, number]] = [
      [0, 0],
      [w, h],
    ];

    const zoom = d3
      .zoom()
      .scaleExtent([1, 100])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', zoomed)
      .on('zoom.end', zoomend);

    svg.call(zoom);

    function zoomed(event: d3.D3ZoomEvent<Element, unknown>) {
      const t = event.transform;
      const xScaleZ = t.rescaleX(xScale);
      const hideTicksWithoutLabel = function () {
        svg.selectAll('.xAxis .tick text').each(function (this: any, d) {
          if (this.innerHTML === '') {
            this.parentNode.style.display = 'none';
          }
        });
      };

      gX.call(
        d3.axisBottom(xScaleZ).tickFormat((i) => {
          if (i >= 0 && i <= dates.length - 1) {
            const d = dates[i as number];
            let hours = d.getHours();
            let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
            let amPM = hours < 13 ? 'am' : 'pm';
            return (
              hours +
              ':' +
              minutes +
              amPM +
              ' ' +
              d.getDate() +
              ' ' +
              months[d.getMonth()] +
              ' ' +
              d.getFullYear()
            );
          }
        })
      );

      candles
        .attr('x', (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
        .attr('width', xBand.bandwidth() * t.k);
      stems.attr('x1', (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5);
      stems.attr('x2', (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5);

      hideTicksWithoutLabel();

      gX.selectAll('.tick text').call(wrap, xBand.bandwidth());
    }

    function zoomend(event: d3.D3ZoomEvent<Element, unknown>) {
      const xScaleZ = event.transform.rescaleX(xScale);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        const xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
        const xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
        const filtered = prices.filter((d) => d.Date >= xmin && d.Date <= xmax);
        const minP = +d3.min(filtered, (d) => d.Low);
        const maxP = +d3.max(filtered, (d) => d.High);
        const buffer = Math.floor((maxP - minP) * 0.1);

        yScale.domain([minP - buffer, maxP + buffer]);
        candles
          .transition()
          .duration(800)
          .attr('y', (d) => yScale(Math.max(+d.Open, +d.Close)))
          .attr('height', (d) =>
            d.Open === d.Close
              ? 1
              : yScale(Math.min(+d.Open, +d.Close)) - yScale(Math.max(+d.Open, +d.Close))
          );

        stems
          .transition()
          .duration(800)
          .attr('y1', (d) => yScale(+d.High))
          .attr('y2', (d) => yScale(+d.Low));

        gY.transition().duration(800).call(d3.axisLeft(yScale));
      }, 500);
    }

    function resize(width: number, height: number) {
      if (width === prevWidth && height === prevWidth) return;
      prevWidth = width;
      prevHeight = height;
      w = width - margin.left - margin.right;
      h = height - margin.top - margin.bottom;

      extent = [
        [0, 0],
        [w, h],
      ];

      rect.attr('width', w).attr('height', h);

      defs.attr('width', w).attr('height', h);

      svg
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom);

      gX.attr('transform', 'translate(0,' + h + ')');

      xScale.range([0, w]);
      xBand.range([0, w]);
      yScale.range([h, 0]).nice();

      zoom.translateExtent(extent).extent(extent);
    }

    resizeFn = resize;
  }

  function wrap(text: d3.Selection<any, any, any, any>, width: number) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let line = [];
      let word: string;
      let lineNumber = 0;
      let lineHeight = 1.1; // ems
      let y = text.attr('y');
      let dy = parseFloat(text.attr('dy'));
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em');
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

  function tryDraw() {
    if (destroyed) return;
    const width = outer.clientWidth;
    const height = outer.clientHeight;

    if (width <= 0 || height <= 0) {
      setTimeout(tryDraw, 500);
      return;
    }

    prevWidth = width;
    prevHeight = height;
    drawChart();
  }

  onMount(() => {
    tryDraw();

    return () => {
      destroyed = true;
      resizeFn = undefined;
    };
  });

  export function resize() {
    if (destroyed) return;
    const width = outer.clientWidth;
    const height = outer.clientHeight;
    resizeFn(width, height);
  }
</script>

<svelte:window on:resize={resize} />

<div bind:this={outer} style="position: relative; overflow: hidden; width: 100%; height: 100%;">
  <div style="position: absolute;">
    <svg class="text-fg-primary" bind:this={element} />
  </div>
</div>

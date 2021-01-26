import uPlot, { Plugin } from 'uplot';

export interface ColumnHighlightOptions {
  className?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
}

export function columnHighlightPlugin({ className, style }: ColumnHighlightOptions = {}): Plugin {
  let underEl: HTMLElement, overEl: HTMLElement, highlightEl: HTMLElement, currIdx: number;

  function init(u: uPlot) {
    underEl = u.root.querySelector('.u-under');
    overEl = u.root.querySelector('.u-over');
    highlightEl = document.createElement('div');

    className && highlightEl.classList.add(...(Array.isArray(className) ? className : [className]));

    uPlot.assign(highlightEl.style, {
      pointerEvents: 'none',
      display: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      ...style,
    });

    underEl.appendChild(highlightEl);

    // show/hide highlight on enter/exit
    overEl.addEventListener('mouseenter', () => {
      highlightEl.style.display = null;
    });

    overEl.addEventListener('mouseleave', () => {
      highlightEl.style.display = 'none';
    });
  }

  function update(u: uPlot) {
    if (currIdx !== u.cursor.idx) {
      currIdx = u.cursor.idx;

      let [iMin, iMax] = u.series[0].idxs;

      const dx = iMax - iMin;
      const width = u.bbox.width / dx / devicePixelRatio;
      const xVal = u.scales.x.distr == 2 ? currIdx : u.data[0][currIdx];
      const left = u.valToPos(xVal, 'x') - width / 2;

      highlightEl.style.transform = 'translateX(' + Math.round(left) + 'px)';
      highlightEl.style.width = Math.round(width) + 'px';
    }
  }

  return {
    opts: (_, opts) => {
      uPlot.assign(opts, {
        cursor: {
          x: false,
          y: false,
        },
      });
    },
    hooks: {
      init: init,
      setCursor: update,
    },
  };
}

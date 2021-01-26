import uPlot, { Plugin } from 'uplot';

export interface LegendAsTooltipOptions {
  className?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
}

export function legendAsTooltipPlugin({ className, style }: LegendAsTooltipOptions = {}): Plugin {
  let legendEl: HTMLElement;

  function init(u: uPlot) {
    legendEl = u.root.querySelector('.u-legend');

    legendEl.classList.remove('u-inline');
    className && legendEl.classList.add(...(Array.isArray(className) ? className : [className]));

    uPlot.assign(legendEl.style, {
      textAlign: 'left',
      pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 100,
      display: 'flex',
      fontSize: '0.5rem',
      flexWrap: 'wrap',
      marginLeft: '35px',
      marginRight: '35px',
      ...style,
    });

    // hide series color markers
    const ident = legendEl.querySelectorAll('.u-marker') as NodeListOf<HTMLElement>;
    for (let i = 0; i < ident.length; ++i) ident[i].style.display = 'none';

    const labels = legendEl.querySelectorAll('.u-label') as NodeListOf<HTMLElement>;
    for (let i = 0; i < labels.length; ++i) {
      let color = u.series[i].stroke;
      if (typeof color === 'function') color = color(u, i);
      console.log(color);
      if (typeof color === 'string') {
        labels[i].style.color = color;
      }
    }

    const overEl = u.root.querySelector('.u-over') as HTMLElement;
    overEl.style.overflow = 'visible';
  }

  return {
    hooks: {
      init: init,
    },
  };
}

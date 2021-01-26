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
      display: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1000,
      // boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
      ...style,
    });

    // hide series color markers
    const ident = legendEl.querySelectorAll('.u-marker') as NodeListOf<HTMLElement>;
    for (let i = 0; i < ident.length; i++) ident[i].style.display = 'none';

    const overEl = u.root.querySelector('.u-over') as HTMLElement;
    overEl.style.overflow = 'visible';

    // move legend into plot bounds
    overEl.appendChild(legendEl);

    // show/hide tooltip on enter/exit
    overEl.addEventListener('mouseenter', () => {
      legendEl.style.display = null;
    });

    overEl.addEventListener('mouseleave', () => {
      legendEl.style.display = 'none';
    });

    // let tooltip exit plot
    // overEl.style.overflow = "visible";
  }

  function update(u: uPlot) {
    const { left, top } = u.cursor;
    legendEl.style.transform = 'translate(' + left + 'px, ' + top + 'px)';
  }

  return {
    hooks: {
      init: init,
      setCursor: update,
    },
  };
}

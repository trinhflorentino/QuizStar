import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function MathConfig() {
  const config = {
    loader: { load: ['[tex]/html', '[tex]/mhchem'] },
    tex: {
      packages: { '[+]': ['html'] },
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]'],
      ],
    },
  };

  const equation = `
    When $a \\ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
    $$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$
  `;

  return (
      <div>
        <MathJax inline>{'\\(\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{z}\\)'}</MathJax>
        <p>
          Here is an inline formula: <MathJax inline>{'\\( a^2 + b^2 = c^2 \\)'}</MathJax>.
        </p>
        <p>
          And a block formula:
          <MathJax block>
            {'\\(\\sum_{i=1}^n i = \\frac{n(n+1)}{2}\\)'}
          </MathJax>
        </p>
        <p>
          {equation}
        </p>
      </div>
  );
}

export default MathConfig;
import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface MemoizedMathJaxProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const MemoizedMathJax = React.memo<MemoizedMathJaxProps>(({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
));

MemoizedMathJax.displayName = 'MemoizedMathJax';


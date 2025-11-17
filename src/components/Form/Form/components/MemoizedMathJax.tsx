import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface MemoizedMathJaxProps {
  children: React.ReactNode;
  inline?: boolean;
  dynamic?: boolean;
  className?: string;
}

export const MemoizedMathJax = React.memo<MemoizedMathJaxProps>(({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
));

MemoizedMathJax.displayName = 'MemoizedMathJax';



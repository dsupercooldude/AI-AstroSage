import * as ReactNamespace from 'react';
import * as ReactDOMNamespace from 'react-dom';

const React = (ReactNamespace as any).default || ReactNamespace;
const ReactDOM = (ReactDOMNamespace as any).default || ReactDOMNamespace;

// Attach React & standard hooks globally to window for legacy JSX module compatibility
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
  (window as any).useRef = React.useRef;
  (window as any).useMemo = React.useMemo;
  (window as any).useCallback = React.useCallback;
  (window as any).Fragment = React.Fragment;
  (window as any).Component = React.Component;
}

export { React, ReactDOM };

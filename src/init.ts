import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Attach React & standard hooks globally to window for legacy JSX module compatibility
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).useState = React.useState;
(window as any).useEffect = React.useEffect;
(window as any).useRef = React.useRef;
(window as any).useMemo = React.useMemo;
(window as any).useCallback = React.useCallback;
(window as any).Fragment = React.Fragment;
(window as any).Component = React.Component;

export { React, ReactDOM };

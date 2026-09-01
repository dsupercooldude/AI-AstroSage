import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment, Component } from 'react';
import ReactDOM from 'react-dom';

// Attach React & standard hooks globally to window for legacy JSX module compatibility
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).useState = useState;
(window as any).useEffect = useEffect;
(window as any).useRef = useRef;
(window as any).useMemo = useMemo;
(window as any).useCallback = useCallback;
(window as any).Fragment = Fragment;
(window as any).Component = Component;

export { React, ReactDOM };

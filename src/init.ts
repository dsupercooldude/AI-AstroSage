import * as ReactNamespace from 'react';
import * as ReactDOMNamespace from 'react-dom';
import './js/i18n';

const React = (ReactNamespace as any).default || ReactNamespace;
const ReactDOM = (ReactDOMNamespace as any).default || ReactDOMNamespace;

// Crash-guard: Prevent Google Translate (or other DOM-mutating tools) from causing React removeChild / insertBefore crashes
if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (console && console.warn) {
        console.warn('Translate Guard: prevented removeChild on alien child node', child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console && console.warn) {
        console.warn('Translate Guard: prevented insertBefore with alien reference node', newNode, referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments as any);
  };
}

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


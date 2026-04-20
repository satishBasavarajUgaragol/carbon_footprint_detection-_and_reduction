import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Defensive wrapper: intercept Ethereum provider methods to avoid uncaught
// errors from wallet extensions (e.g., MetaMask) causing runtime exceptions
// when the app does not explicitly request a connection. This wraps
// `ethereum.request` and `ethereum.enable` to catch promise rejections
// and log them safely. Keep minimal to avoid changing wallet behavior.
declare global {
  interface Window { ethereum?: any }
}

if (typeof window !== 'undefined' && window.ethereum) {
  try {
    const eth = window.ethereum as any;

    if (eth.request && typeof eth.request === 'function') {
      const _origRequest = eth.request.bind(eth);
      eth.request = (...args: any[]) => {
        try {
          const result = _origRequest(...args);
          if (result && typeof result.then === 'function') {
            return result.catch((err: any) => {
              console.warn('ethereum.request failed:', err);
              return Promise.reject(err);
            });
          }
          return result;
        } catch (err) {
          console.warn('ethereum.request threw synchronously:', err);
          return Promise.reject(err);
        }
      };
    }

    if (eth.enable && typeof eth.enable === 'function') {
      const _origEnable = eth.enable.bind(eth);
      eth.enable = () => {
        try {
          const res = _origEnable();
          if (res && typeof res.then === 'function') {
            return res.catch((err: any) => {
              console.warn('ethereum.enable failed:', err);
              return Promise.reject(err);
            });
          }
          return res;
        } catch (err) {
          console.warn('ethereum.enable threw synchronously:', err);
          return Promise.reject(err);
        }
      };
    }
    
    // Wrap any explicit 'connect' method if present (some wallets expose this)
    try {
      const connectKeys = Object.keys(eth).filter(k => /connect/i.test(k) && typeof (eth as any)[k] === 'function');
      connectKeys.forEach(key => {
        const _orig = (eth as any)[key].bind(eth);
        (eth as any)[key] = (...args: any[]) => {
          try {
            const res = _orig(...args);
            if (res && typeof res.then === 'function') {
              return res.catch((err: any) => {
                console.warn(`ethereum.${key} failed:`, err);
                return Promise.reject(err);
              });
            }
            return res;
          } catch (err) {
            console.warn(`ethereum.${key} threw synchronously:`, err);
            return Promise.reject(err);
          }
        };
      });
    } catch (wrapErr) {
      console.warn('Failed to wrap ethereum.connect-like methods:', wrapErr);
    }
  } catch (e) {
    // Swallow any unexpected errors during wrapping to avoid blocking app start
    // Keep a light log for diagnostics
    // Note: we do not change provider behavior beyond adding safe catches
    // which prevents unhandled promise rejection console errors.
    // If deeper wallet integration is needed, implement explicit connect flows.
    // eslint-disable-next-line no-console
    console.warn('Failed to wrap window.ethereum safely:', e);
  }

// Suppress noisy MetaMask/extension errors about failed connect attempts
// while preserving other runtime errors. This prevents the extension
// from producing uncaught errors that interrupt user flows when no
// wallet connect was requested by the app.
window.addEventListener('error', (evt: ErrorEvent) => {
  try {
    const msg = (evt && evt.message) ? evt.message.toString().toLowerCase() : '';
    if (msg.includes('failed to connect to metamask') || msg.includes('metamask')) {
      // Prevent default logging to console for these known extension errors
      evt.preventDefault();
      // Keep a lightweight log for diagnostics
      // eslint-disable-next-line no-console
      console.warn('Suppressed MetaMask error event:', evt.message);
    }
  } catch (_e) {
    // ignore
  }
});

  // Capture unhandled promise rejections to avoid noisy extension errors
  window.addEventListener('unhandledrejection', (evt) => {
    try {
      const reason = (evt as any).reason;
      if (reason && typeof reason === 'object' && (reason.message || '').toString().toLowerCase().includes('metamask')) {
        // prevent default logging for known MetaMask connect failures
        evt.preventDefault();
        console.warn('Suppressed MetaMask unhandled rejection:', reason);
      }
    } catch (_err) {
      // ignore
    }
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

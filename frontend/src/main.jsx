import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './firebase.js'
import { reportWebVitals } from './utils/performance.js'

// Add resource hints for performance
const addResourceHint = (rel, href, as) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  document.head.appendChild(link);
};
addResourceHint('preconnect', 'https://fonts.googleapis.com');
addResourceHint('preconnect', 'https://fonts.gstatic.com');
addResourceHint('preconnect', 'https://cdn.jsdelivr.net');
addResourceHint('dns-prefetch', 'https://i.pravatar.cc');
addResourceHint('dns-prefetch', 'https://images.unsplash.com');

initAnalytics();

// Report Core Web Vitals for performance monitoring
reportWebVitals(({ name, value }) => {
  if (import.meta.env.DEV) {
    // In development: log metrics to console for debugging
    console.debug(`[WebVitals] ${name}: ${value}`);
  }
  // In production: metrics could be forwarded to an analytics endpoint
  // e.g. sendToAnalytics({ name, value });
});

/**
 * Hides third-party watermark elements injected by external SDKs
 * using an efficient MutationObserver rather than polling.
 * @param {Node} target - The DOM node to inspect.
 */
const hideWatermarkNode = (target) => {
  if (!target || target.nodeType !== Node.ELEMENT_NODE) return;
  const text = target.innerText || target.textContent || '';
  if (text.toLowerCase().includes('made with') && text.toLowerCase().includes('unicorn')) {
    target.style.setProperty('display', 'none', 'important');
    target.style.setProperty('opacity', '0', 'important');
    target.style.setProperty('visibility', 'hidden', 'important');
    target.style.setProperty('pointer-events', 'none', 'important');
  }
  if (target.shadowRoot) {
    target.shadowRoot.querySelectorAll('*').forEach((s) => {
      if (s.textContent && s.textContent.toLowerCase().includes('unicorn.studio')) {
        s.style.display = 'none';
      }
    });
  }
};

const watermarkObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => hideWatermarkNode(node));
  });
});
watermarkObserver.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

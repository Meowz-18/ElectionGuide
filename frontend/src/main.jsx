import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './firebase.js'

initAnalytics();

// Ultimate Nuclear Watermark Removal
const style = document.createElement('style');
style.innerHTML = `
  [href*="unicorn.studio"], 
  [class*="watermark"], 
  #unicorn-studio-canvas + div,
  [class*="UnicornStudio"] + div,
  div:empty:not(#unicorn-studio-canvas),
  #unicorn-studio-canvas ~ div:not(section):not(main):not(header) {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }
`;
document.head.appendChild(style);

const prune = () => {
  const all = document.querySelectorAll('div, a, span, p');
  all.forEach(el => {
    // Check shadow roots recursively
    if (el.shadowRoot) {
      el.shadowRoot.querySelectorAll('*').forEach(s => {
        if (s.textContent && s.textContent.toLowerCase().includes('unicorn.studio')) {
          s.style.display = 'none';
        }
      });
    }

    // Check if the text matches "Made with unicorn.studio"
    const text = el.innerText || el.textContent || "";
    if (text.toLowerCase().includes('made with') && text.toLowerCase().includes('unicorn')) {
       // Hide the smallest possible container that has the text
       el.style.setProperty('display', 'none', 'important');
       el.style.setProperty('opacity', '0', 'important');
       el.style.setProperty('visibility', 'hidden', 'important');
       el.style.setProperty('pointer-events', 'none', 'important');
    }
  });
};
setInterval(prune, 100);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

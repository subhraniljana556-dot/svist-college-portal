import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// ================================================================
// ERROR BOUNDARY WRAPPING
// ================================================================
// The ErrorBoundary wraps the ENTIRE application tree, including
// the Router. This means:
// 1. If ANY component anywhere in the tree throws during render,
//    the Error Boundary catches it and shows a recovery page.
// 2. Without this, React unmounts the entire tree and shows a
//    blank white page — the dreaded "white screen of death."
// 3. The ErrorBoundary is OUTSIDE StrictMode because StrictMode
//    intentionally double-renders in development to find bugs.
//    We don't want ErrorBoundary to interfere with that behavior.
// ================================================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
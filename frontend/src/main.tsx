// Entry point bootstrapping React and rendering App into the root element.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Render the entire app with React strict mode for dev warnings */}
    <App />
  </StrictMode>,
)

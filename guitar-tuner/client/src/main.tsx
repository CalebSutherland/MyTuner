import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import App from './App'

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
      <Analytics />
      <SpeedInsights />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
/**
 * main.jsx - Application Entry Point
 * 
 * This file:
 * - Initializes the React application
 * - Sets up the root rendering
 * - Imports global styles
 * - Provides the main app mounting point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create the root element and render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
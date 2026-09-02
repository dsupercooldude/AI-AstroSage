import './init';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Ensure core calculation and utility scripts are loaded
import './js/cryptography.js';
import './js/formulas.js';
import './js/ai-rules.js';
import './js/database.js';
import './js/passkeys.js';
import './js/pdf-validation.js';
import './js/calendar.js';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


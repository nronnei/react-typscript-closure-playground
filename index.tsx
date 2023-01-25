import React from 'react';
import { createRoot } from "react-dom/client";
import { App } from './App';

createRoot(document.getElementById('playground') as HTMLElement).render(<App />);

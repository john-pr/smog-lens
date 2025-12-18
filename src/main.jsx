import './index.css'
import "./i18n";
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import ThemeProvider from './app/ThemeContext.jsx';
import ToastProvider from './app/ToastContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
     <Suspense fallback={null}>
        <Provider store={store}>
          <ThemeProvider>
            <ToastProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ToastProvider>
          </ThemeProvider>
        </Provider>
    </Suspense>
  // </StrictMode> 
)

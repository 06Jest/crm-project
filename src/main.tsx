import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import App from './App';
import { getTheme } from './theme';
import { store } from './store/store' 

export  function ThemedApp() {
  const themeMode = useSelector(
    (state: RootState) => state.ui.themeMode
  );
  const theme = getTheme(themeMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);
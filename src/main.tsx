import React, {  type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import App from './App';
import { getTheme } from './theme';
import { store } from './store/store' 
import { SidebarProvider } from './context/SidebarProvider';
import AppInitializer from './AppInitializer';
import { DockProvider } from './context/DockProvider';
import DockContainer from './components/DockContainer';
import NotesPanel from './components/panels/NotesPanel';
import EmailsPanel from './components/panels/EmailPanel';
import TasksPanel from './components/panels/TasksPanel';
import CallsPanel from './components/panels/CallsPanel';
import SmsPanel from './components/panels/SMSPanel';
import ChatsPanel from './components/panels/ChatsPanel';
import { BrowserRouter } from 'react-router-dom';

export  function ThemedApp() {
  const themeMode = useSelector(
    (state: RootState) => state.ui.themeMode
  );
  const theme = getTheme(themeMode);

  const panelRegistry: Record<string, ReactNode> = {
    notes: <NotesPanel />,
    tasks: <TasksPanel />,
    chats: <ChatsPanel />,
    emails: <EmailsPanel />,
    calls: <CallsPanel />,
    sms: <SmsPanel />,
  };  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppInitializer>
        <App />
      </AppInitializer>
       <DockContainer renderContent={(id) => panelRegistry[id] ?? null} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render( 
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SidebarProvider>
          <DockProvider>
            <ThemedApp />
          </DockProvider>
        </SidebarProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
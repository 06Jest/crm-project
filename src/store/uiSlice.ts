
import { createSlice } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
  isAIWorkspaceOpen: boolean;
}

const getSavedTheme = (): ThemeMode => {
  const saved = localStorage.getItem('crm_theme');
  if (saved === 'dark' || saved === 'light') return saved;

  const preferDark = window.matchMedia(
    '(prefers-color-scheme:dark)'
  ).matches;
  return preferDark ? 'dark' : 'light';
};

const initialState: UIState = {
  themeMode: getSavedTheme(),
  isAIWorkspaceOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('crm_theme', state.themeMode);
    },

    setTheme: (state, action: { payload: ThemeMode }) => {
      state.themeMode = action.payload;
      localStorage.setItem('crm_theme', action.payload);
    },

    openAIWorkspace: (state) => {
      state.isAIWorkspaceOpen = true;
    },

    closeAIWorkspace: (state) => {
      state.isAIWorkspaceOpen = false;
    },
    
  },
});

export const {
  toggleTheme,
  setTheme,
  openAIWorkspace,
  closeAIWorkspace,
} = uiSlice.actions;

export default uiSlice.reducer;
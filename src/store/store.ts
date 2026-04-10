import { configureStore } from "@reduxjs/toolkit"
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    leads: leadsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
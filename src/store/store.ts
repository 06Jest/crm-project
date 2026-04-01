import { configureStore } from "@reduxjs/toolkit"
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    leads: leadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
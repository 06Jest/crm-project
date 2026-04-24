import { configureStore } from "@reduxjs/toolkit"
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"
import uiReducer from './uiSlice'
import activitiesReducer from './activitiesSlice';
import customersReducer from './customersSlice';
import messagingReducer from './messagingSlice';
import dealsReducer from './dealsSlice';

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    activities: activitiesReducer,
    customers: customersReducer,
    messaging: messagingReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
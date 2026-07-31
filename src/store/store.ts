import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import profileReducer from "./ProfileSlice"
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"
import uiReducer from './uiSlice'
// import activitiesReducer from './activitiesSlice';
import customersReducer from './customersSlice';
import callsReducer from './callsSlice';
import dealsReducer from './dealsSlice';
import emailsReducer from './emailSlice';
import notesReducer from './notesSlice';
import tasksReducer from './tasksSlice'
import conversatiosReducer from './conversationsSlice'
import messagesReducer from './messagesSlice'
// import superAdminReducer from './superAdminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, 
    profile: profileReducer,
    contacts: contactsReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    notes: notesReducer,
    emails: emailsReducer,
    tasks: tasksReducer,
    conversations: conversatiosReducer,
    messages: messagesReducer,
    // activities: activitiesReducer,
    customers: customersReducer,
    calls: callsReducer,
    // superAdmin: superAdminReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
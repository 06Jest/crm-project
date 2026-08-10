import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import profileReducer from "./profileSlice"
import subscriptionReducer from './subscriptionSlice';
import organizationReducer from './organizationSlice';
import orgMembersReducer from './organizationMemberSlice';
import orgInvitesReducer from './organizationInviteSlice';
import dashboardReducer from './dashboardSlice'
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"
import uiReducer from './uiSlice'
import activitiesReducer from './activitiesSlice';
import customersReducer from './customersSlice';
import callsReducer from './callsSlice';
import dealsReducer from './dealsSlice';
import emailsReducer from './emailSlice';
import notesReducer from './notesSlice';
import tasksReducer from './tasksSlice'
import conversatiosReducer from './conversationsSlice'
import messagesReducer from './messagesSlice'
import smsReducer from './smsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer, 
    profile: profileReducer,
    organization: organizationReducer,
    subscription: subscriptionReducer,
    orgmembers: orgMembersReducer,
    orginvites: orgInvitesReducer,
    dashboard: dashboardReducer,
    contacts: contactsReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    notes: notesReducer,
    emails: emailsReducer,
    tasks: tasksReducer,
    conversations: conversatiosReducer,
    messages: messagesReducer,
    activities: activitiesReducer,
    customers: customersReducer,
    calls: callsReducer,
    sms: smsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
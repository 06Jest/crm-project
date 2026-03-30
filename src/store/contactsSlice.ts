import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "../types/contact"

const loadFromStorage = (): Contact[] => {
  const data = localStorage.getItem("crm_contacts")
  return data ? JSON.parse(data) : []
} 

const saveToStorage = (contacts: Contact[]) => {
  localStorage.setItem("crm_contacts", JSON.stringify(contacts))
}

const initialState: Contact[] = loadFromStorage()

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.push(action.payload)
      saveToStorage(state)
    },

    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
        saveToStorage(state)
      }
    },

    deleteContact: (state, action: PayloadAction<string>) => {
      const newState = state.filter(c => c.id !== action.payload)
      saveToStorage(newState)
      return newState
    },
  },
})

export const { addContact, updateContact, deleteContact } = contactsSlice.actions
export default contactsSlice.reducer
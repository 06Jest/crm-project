import type { Contact } from "../types/contact"

const CONTACTS_KEY = "crm_contacts"

export const getContacts = (): Contact[] => {
  const data = localStorage.getItem(CONTACTS_KEY)
  return data ? JSON.parse(data) : []
}

export const saveContacts = (contacts: Contact[]) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
}

export const addContact = (contact: Contact) => {
  const contacts = getContacts()
  contacts.push(contact)
  saveContacts(contacts)
}

export const updateContact = (updatedContact: Contact) => {
  const contacts = getContacts()

  const updatedContacts = contacts.map((contact) =>
    contact.id === updatedContact.id ? updatedContact : contact
  )

  saveContacts(updatedContacts)
}

export const deleteContact = (id: string) => {
  const contacts = getContacts()

  const filteredContacts = contacts.filter(
    (contact) => contact.id !== id
  )

  saveContacts(filteredContacts)
}
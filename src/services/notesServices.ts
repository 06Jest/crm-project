
import type { AddNote, NoteListItem, UpdateNote } from "../types/notes";
import { apiClient } from "./apiClient";


export const fetchNotesAPI = async (): Promise<NoteListItem[]> => {
  const result = await apiClient("/api/notes/show-notes", {
    method: "GET",
  });

  return result.data as NoteListItem[];
};

export const fetchPublicNotesAPI = async (): Promise<NoteListItem[]> => {
  const result = await apiClient("/api/notes/show-public-notes", {
    method: "GET",
  });

  return result.data as NoteListItem[];
};

export const fetchPrivateNotesAPI = async (): Promise<NoteListItem[]> => {
  const result = await apiClient("/api/notes/show-private-notes", {
    method: "GET",
  });

  return result.data as NoteListItem[];
};

export const fetchNoteByIDAPI = async (
  id: string
): Promise<NoteListItem> => {
  const result = await apiClient(`/api/notes/show-note/${id}`, {
    method: "GET",
  });

  return result.data as NoteListItem;
};

export const addNoteAPI = async (
  note: AddNote
): Promise<NoteListItem> => {
  const result = await apiClient("/api/notes/add-note", {
    method: "POST",
    body: JSON.stringify(note),
  });

  return result.data as NoteListItem;
};

export const updateNoteAPI = async (
  id: string,
  note: UpdateNote
): Promise<NoteListItem> => {
  const result = await apiClient(`/api/notes/update-note/${id}`, {
    method: "PATCH",
    body: JSON.stringify(note),
  });

  return result.data as NoteListItem;
};

export const pinNoteAPI = async (
  id: string,
  pinned: boolean
): Promise<NoteListItem> => {
  const result = await apiClient(`/api/notes/pin-note/${id}`, {
    method: "PATCH",
    body: JSON.stringify({pinned}),
  });

  return result.data as NoteListItem;
};

export const deletePrivateNoteAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/notes/delete-private-note/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteNoteAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/notes/delete-note/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};
export interface NotesState {
  items: NoteListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}


export const NOTE_TARGET_TYPES = [
  "lead",
  "contact",
  "deal",
  "customer",
  "personal"
] as const;

export type NoteTargetType = typeof NOTE_TARGET_TYPES[number];

export const NOTE_VISIBILITIES = [
  "public",
  "private",
] as const;

export type NoteVisibility = typeof NOTE_VISIBILITIES[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  org_id: string;
  author_id: string;
  target_type: NoteTargetType;
  target_id: string;
  visibility: NoteVisibility;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface AddNote {
  target_type: NoteTargetType;
  target_id: string | null;
  title: string;
  content: string;
  visibility?: NoteVisibility;
}

export interface UpdateNote {
  target_type: NoteTargetType;
  target_id: string | null;
  title: string;
  content: string;
  visibility?: NoteVisibility;
}


export interface NoteListItem extends Note {
  author: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

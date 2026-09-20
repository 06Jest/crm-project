export type ArchiveType = "archived" | "deleted";

export interface ArchiveState {
  items: ArchiveRecord[];
  type: ArchiveType;
  entity: ArchiveEntityFilter;
  search: string;
  page: number;
  limit: number;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export type ArchiveEntity =
  | "leads"
  | "contacts"
  | "deals"
  | "customers"
  | "tasks"
  | "notes"
  | "calls"
  | "sms";

export type ArchiveEntityFilter = ArchiveEntity | "all";

export interface ArchiveRecord {
  id: string;
  entityType: ArchiveEntity;
  displayId?: string;
  title: string;
  archivedAt: string | null;
  archivedBy: {
    id: string;
    displayName: string;
  } | null;
  deletedAt: string | null;
  deletedBy: {
    id: string;
    displayName: string;
  } | null;
  createdAt: string;
}

export interface ArchiveListQuery {
  type: ArchiveType;
  entity: ArchiveEntityFilter;
  search?: string;
  page: number;
  limit: number;
}

export interface ArchiveListResponse {
  data: ArchiveRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export type KanbanColumnId = "todo" | "in-progress" | "complete";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  columnId: KanbanColumnId;
  createdAt: number;
  updatedAt: number;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  taskIds: string[];
}

export interface KanbanState {
  tasks: Record<string, KanbanTask>;
  columns: Record<KanbanColumnId, KanbanColumn>;
  columnOrder: KanbanColumnId[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface TodoState {
  items: TodoItem[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
}

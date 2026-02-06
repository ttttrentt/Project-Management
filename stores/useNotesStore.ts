import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Note, NotesState } from "@/types";
import { generateId } from "@/lib/utils";

interface NotesActions {
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Pick<Note, "title" | "content">>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
}

const initialState: NotesState = {
  notes: [],
  activeNoteId: null,
};

export const useNotesStore = create<NotesState & NotesActions>()(
  persist(
    (set) => ({
      ...initialState,

      addNote: () => {
        const id = `note-${generateId()}`;
        const now = Date.now();

        set((state) => ({
          notes: [
            {
              id,
              title: "Untitled",
              content: "",
              createdAt: now,
              updatedAt: now,
            },
            ...state.notes,
          ],
          activeNoteId: id,
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = state.notes.filter((note) => note.id !== id);
          return {
            notes: newNotes,
            activeNoteId:
              state.activeNoteId === id
                ? newNotes[0]?.id ?? null
                : state.activeNoteId,
          };
        });
      },

      setActiveNote: (id) => {
        set({ activeNoteId: id });
      },
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

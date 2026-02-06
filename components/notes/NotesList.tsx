"use client";

import { useNotesStore } from "@/stores/useNotesStore";
import { cn } from "@/lib/utils";

export function NotesList() {
  const { notes, activeNoteId, setActiveNote, deleteNote } = useNotesStore();

  if (notes.length === 0) return null;

  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {notes.map((note, index) => (
        <button
          key={note.id}
          onClick={() => setActiveNote(note.id)}
          className={cn(
            "group relative flex-shrink-0 px-3 py-2 rounded-lg text-left transition-all duration-200 animate-in opacity-0",
            activeNoteId === note.id
              ? "bg-[var(--color-charcoal)] shadow-[0_0_0_1px_var(--color-ember)]/30"
              : "hover:bg-[var(--color-charcoal)]/50"
          )}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span
            className={cn(
              "block text-xs max-w-[80px] truncate transition-colors",
              activeNoteId === note.id
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-dim)]"
            )}
          >
            {note.title || "Untitled"}
          </span>

          {/* Active indicator */}
          {activeNoteId === note.id && (
            <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--color-ember)]" />
          )}

          {/* Delete on hover */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-charcoal)] border border-[var(--color-ash)] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[var(--color-danger)] hover:border-[var(--color-danger)] transition-all duration-200"
          >
            <svg className="w-2 h-2 text-[var(--color-text-ghost)] hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      ))}
    </div>
  );
}

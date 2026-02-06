"use client";

import { useNotesStore } from "@/stores/useNotesStore";
import { NotesList } from "./NotesList";
import { NotesEditor } from "./NotesEditor";

export function NotesPanel() {
  const { notes, activeNoteId, addNote } = useNotesStore();
  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl italic text-[var(--color-text)]">
              Notes
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-ghost)] mt-0.5">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
          <button
            onClick={addNote}
            className="w-8 h-8 rounded-lg border border-[var(--color-ash)] hover:border-[var(--color-ember)] hover:bg-[var(--color-ember)]/5 flex items-center justify-center text-[var(--color-text-ghost)] hover:text-[var(--color-ember)] transition-all duration-200"
            title="New note"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </header>

      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-ash)] to-transparent mx-4" />

      {/* Notes Tabs */}
      {notes.length > 0 && <NotesList />}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        {activeNote ? (
          <NotesEditor note={activeNote} />
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl border border-dashed border-[var(--color-ash)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--color-text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-[11px] text-[var(--color-text-ghost)] uppercase tracking-wide mb-3">
                No notes yet
              </p>
              <button
                onClick={addNote}
                className="text-[11px] text-[var(--color-ember)] hover:text-[var(--color-amber)] uppercase tracking-wide transition-colors"
              >
                Create your first note →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-charcoal)]">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--color-text-ghost)]">
          <span>Auto-save</span>
          <span className="text-[var(--color-success)]">● Enabled</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useNotesStore } from "@/stores/useNotesStore";
import { Note } from "@/types";

interface NotesEditorProps {
  note: Note;
}

export function NotesEditor({ note }: NotesEditorProps) {
  const updateNote = useNotesStore((state) => state.updateNote);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  // Auto-save with debounce
  const saveChanges = (newTitle: string, newContent: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      updateNote(note.id, { title: newTitle, content: newContent });
      setIsSaving(false);
    }, 500);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    saveChanges(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    saveChanges(title, newContent);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full animate-in opacity-0">
      {/* Editor Header */}
      <div className="px-6 pt-4 pb-2">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full bg-transparent text-lg font-serif italic text-[var(--color-text)] placeholder:text-[var(--color-text-ghost)] focus:outline-none"
        />
        <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-text-ghost)] uppercase tracking-wide">
          <span>
            {new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span>·</span>
          <span>{wordCount} words</span>
          {isSaving && (
            <>
              <span>·</span>
              <span className="text-[var(--color-amber)]">Saving...</span>
            </>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-[var(--color-ash)] via-[var(--color-ash)] to-transparent mx-6 my-2" />

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="w-full h-full bg-transparent text-sm text-[var(--color-text-dim)] placeholder:text-[var(--color-text-ghost)] focus:outline-none resize-none leading-relaxed"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </div>
    </div>
  );
}

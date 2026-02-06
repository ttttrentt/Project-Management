"use client";

import { useEffect, useState } from "react";
import { TodoList } from "@/components/todo/TodoList";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { useKanbanStore } from "@/stores/useKanbanStore";
import { useTodoStore } from "@/stores/useTodoStore";
import { useNotesStore } from "@/stores/useNotesStore";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useKanbanStore.persist.rehydrate();
    useTodoStore.persist.rehydrate();
    useNotesStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-void)]">
        <div className="flex items-center gap-3">
          <div className="status-dot animate-pulse" />
          <span className="text-[var(--color-text-dim)] text-sm tracking-wide">
            INITIALIZING
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-void)] overflow-hidden">
      {/* Left Sidebar - Tasks */}
      <aside className="w-72 flex-shrink-0 border-r border-[var(--color-charcoal)] flex flex-col bg-[var(--color-night)]">
        {/* Logo Header */}
        <header className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-ember)] shadow-[0_0_10px_var(--color-ember)]" />
            <h1 className="font-serif text-2xl italic text-[var(--color-text)]">
              Vibe
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-ghost)] ml-5">
            Project Management
          </p>
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-ash)] to-transparent mx-4" />

        {/* Todo Section */}
        <div className="flex-1 overflow-y-auto p-4 pt-6">
          <TodoList />
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-[var(--color-charcoal)]">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--color-text-ghost)]">
            <span>Local Storage</span>
            <span className="text-[var(--color-success)]">● Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content - Kanban */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-void)]">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[var(--color-charcoal)]">
          <div>
            <h2 className="font-serif text-xl italic text-[var(--color-text)]">Board</h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-ghost)] mt-0.5">
              Drag to organize
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-text-ghost)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ember)]" />
              <span>Live</span>
            </div>
          </div>
        </header>

        {/* Kanban Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full p-8">
            <KanbanBoard />
          </div>
        </div>
      </main>

      {/* Right Sidebar - Notes */}
      <aside className="w-80 flex-shrink-0 border-l border-[var(--color-charcoal)] flex flex-col bg-[var(--color-night)]">
        <NotesPanel />
      </aside>
    </div>
  );
}

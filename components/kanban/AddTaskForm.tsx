"use client";

import { useState } from "react";
import { useKanbanStore } from "@/stores/useKanbanStore";
import { KanbanColumnId } from "@/types";

interface AddTaskFormProps {
  columnId: KanbanColumnId;
}

export function AddTaskForm({ columnId }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const addTask = useKanbanStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(columnId, title.trim());
      setTitle("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 text-left text-[11px] text-[var(--color-text-ghost)] hover:text-[var(--color-text-dim)] py-2 px-2 rounded-lg hover:bg-[var(--color-ash)]/30 transition-all duration-200 group"
      >
        <span className="w-5 h-5 rounded-md border border-dashed border-[var(--color-ash)] group-hover:border-[var(--color-text-ghost)] flex items-center justify-center transition-colors">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
        <span className="uppercase tracking-wide">Add task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="bg-[var(--color-night)] border border-[var(--color-ash)] rounded-lg p-3 shadow-[0_0_0_1px_var(--color-ember)]/20 focus-within:shadow-[0_0_0_1px_var(--color-ember),0_0_20px_rgba(245,158,11,0.1)] transition-shadow duration-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title..."
          autoFocus
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-ghost)] focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex-1 bg-[var(--color-ember)] hover:bg-[var(--color-amber)] text-[var(--color-void)] text-[11px] font-medium uppercase tracking-wide py-2 rounded-lg transition-colors duration-200"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setIsOpen(false);
          }}
          className="px-4 py-2 text-[11px] text-[var(--color-text-ghost)] hover:text-[var(--color-text-dim)] uppercase tracking-wide transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

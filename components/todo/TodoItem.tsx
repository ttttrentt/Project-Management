"use client";

import { useState } from "react";
import { useTodoStore } from "@/stores/useTodoStore";
import { TodoItem as TodoItemType } from "@/types";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  item: TodoItemType;
}

export function TodoItem({ item }: TodoItemProps) {
  const { toggleItem, deleteItem, updateItem } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSubmit = () => {
    if (editText.trim()) {
      updateItem(item.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setEditText(item.text);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 bg-[var(--color-charcoal)] rounded-lg">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-[var(--color-text)] text-sm focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--color-charcoal)] transition-all duration-200">
      {/* Custom Checkbox */}
      <button
        onClick={() => toggleItem(item.id)}
        className={cn(
          "relative w-4 h-4 rounded-[4px] border transition-all duration-200 flex-shrink-0",
          item.completed
            ? "bg-[var(--color-ember)] border-[var(--color-ember)] shadow-[0_0_8px_rgba(245,158,11,0.3)]"
            : "border-[var(--color-ash)] hover:border-[var(--color-text-ghost)] hover:shadow-[0_0_8px_rgba(245,158,11,0.1)]"
        )}
      >
        {item.completed && (
          <svg
            className="absolute inset-0 w-full h-full p-0.5 text-[var(--color-void)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Task Text */}
      <span
        onClick={() => !item.completed && setIsEditing(true)}
        className={cn(
          "flex-1 text-sm cursor-pointer transition-colors duration-200",
          item.completed
            ? "text-[var(--color-text-ghost)] line-through"
            : "text-[var(--color-text)] hover:text-[var(--color-amber)]"
        )}
      >
        {item.text}
      </span>

      {/* Delete Button */}
      <button
        onClick={() => deleteItem(item.id)}
        className="opacity-0 group-hover:opacity-100 text-[var(--color-text-ghost)] hover:text-[var(--color-danger)] transition-all duration-200 p-1 -m-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

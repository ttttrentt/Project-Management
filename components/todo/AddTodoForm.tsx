"use client";

import { useState } from "react";
import { useTodoStore } from "@/stores/useTodoStore";

export function AddTodoForm() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const addItem = useTodoStore((state) => state.addItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addItem(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`
          relative overflow-hidden rounded-lg transition-all duration-300
          ${isFocused
            ? 'bg-[var(--color-charcoal)] shadow-[0_0_0_1px_var(--color-ember),0_0_20px_rgba(245,158,11,0.1)]'
            : 'bg-[var(--color-charcoal)] hover:bg-[var(--color-slate)]'
          }
        `}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a task..."
          className="w-full bg-transparent px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-ghost)] focus:outline-none"
        />

        {/* Animated border glow */}
        <div
          className={`
            absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300
            ${isFocused ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: isFocused ? 'shimmer 2s infinite' : 'none'
          }}
        />
      </div>

      {/* Hint text */}
      <div className={`
        flex items-center justify-between mt-2 px-1 text-[10px] text-[var(--color-text-ghost)]
        transition-opacity duration-200
        ${isFocused ? 'opacity-100' : 'opacity-0'}
      `}>
        <span>Press Enter to add</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-ash)] text-[9px]">↵</kbd>
        </span>
      </div>
    </form>
  );
}

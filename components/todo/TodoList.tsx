"use client";

import { useTodoStore } from "@/stores/useTodoStore";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";

export function TodoList() {
  const items = useTodoStore((state) => state.items);

  const pendingItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-ember)]">
            Quick Tasks
          </span>
          <span className="text-[10px] text-[var(--color-text-ghost)]">
            /
          </span>
          <span className="text-[10px] text-[var(--color-text-ghost)]">
            {pendingItems.length}
          </span>
        </div>
      </div>

      {/* Add Form */}
      <AddTodoForm />

      {/* Pending Tasks */}
      <div className="flex flex-col gap-1">
        {pendingItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-in opacity-0"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <TodoItem item={item} />
          </div>
        ))}
      </div>

      {/* Completed Section */}
      {completedItems.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-[var(--color-ash)]" />
            <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-ghost)]">
              Done · {completedItems.length}
            </span>
            <div className="h-px flex-1 bg-[var(--color-ash)]" />
          </div>
          <div className="flex flex-col gap-1 opacity-50">
            {completedItems.map((item) => (
              <TodoItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-8 h-8 rounded-full border border-dashed border-[var(--color-ash)] flex items-center justify-center mb-4">
            <span className="text-[var(--color-text-ghost)] text-lg">+</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-ghost)] uppercase tracking-wide">
            No tasks yet
          </p>
          <p className="text-[10px] text-[var(--color-text-ghost)] mt-1 opacity-60">
            Add your first task above
          </p>
        </div>
      )}
    </div>
  );
}

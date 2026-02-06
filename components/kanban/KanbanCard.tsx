"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "@/stores/useKanbanStore";
import { KanbanTask, KanbanPriority } from "@/types";
import { cn } from "@/lib/utils";

const priorityConfig: Record<KanbanPriority, { borderColor: string; label: string }> = {
  low:    { borderColor: "var(--color-text-ghost)", label: "Low" },
  medium: { borderColor: "var(--color-ember)",      label: "Med" },
  high:   { borderColor: "var(--color-danger)",      label: "High" },
};

const priorityCycle: Record<KanbanPriority, KanbanPriority> = {
  low: "medium",
  medium: "high",
  high: "low",
};

interface KanbanCardProps {
  task: KanbanTask;
  isDragOverlay?: boolean;
}

export function KanbanCard({ task, isDragOverlay }: KanbanCardProps) {
  const { deleteTask, updateTask } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const priority = task.priority ?? "medium";
  const config = priorityConfig[priority];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleCyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask(task.id, { priority: priorityCycle[priority] });
  };

  if (isDragOverlay) {
    return (
      <div
        className="w-72 bg-[var(--color-slate)] border border-[var(--color-ember)] rounded-lg p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.15)] border-l-2"
        style={{ borderLeftColor: config.borderColor }}
      >
        <p className="text-sm text-[var(--color-text)]">{task.title}</p>
        {task.description && (
          <p className="text-xs text-[var(--color-text-dim)] mt-2 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: config.borderColor }}
      className={cn(
        "group relative bg-[var(--color-night)] border border-[var(--color-ash)] border-l-2 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200",
        isDragging && "opacity-40 scale-[0.98]",
        !isDragging && "hover:border-[var(--color-text-ghost)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      )}
      {...attributes}
      {...listeners}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[var(--color-ember)]/0 to-[var(--color-ember)]/0 group-hover:from-[var(--color-ember)]/[0.02] group-hover:to-transparent transition-all duration-300 pointer-events-none" />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="relative w-full bg-transparent text-sm text-[var(--color-text)] focus:outline-none"
        />
      ) : (
        <p
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="relative text-sm text-[var(--color-text)] cursor-text leading-relaxed"
        >
          {task.title}
        </p>
      )}

      {task.description && !isEditing && (
        <p className="relative text-xs text-[var(--color-text-dim)] mt-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Timestamp + Priority */}
      <div className="relative flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-ash)]/50">
        <span className="text-[10px] text-[var(--color-text-ghost)] tabular-nums">
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button
          onClick={handleCyclePriority}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded transition-all duration-200 hover:brightness-125"
          style={{ color: config.borderColor, backgroundColor: `color-mix(in srgb, ${config.borderColor} 15%, transparent)` }}
        >
          {config.label}
        </button>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[var(--color-text-ghost)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all duration-200"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

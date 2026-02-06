"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn as KanbanColumnType, KanbanTask } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { AddTaskForm } from "./AddTaskForm";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
}

const columnConfig = {
  todo: {
    label: "To Do",
    icon: "○",
    accentClass: "text-[var(--color-text-dim)]",
    dotClass: "bg-[var(--color-text-ghost)]",
  },
  "in-progress": {
    label: "In Progress",
    icon: "◐",
    accentClass: "text-[var(--color-amber)]",
    dotClass: "bg-[var(--color-amber)]",
  },
  complete: {
    label: "Complete",
    icon: "●",
    accentClass: "text-[var(--color-success)]",
    dotClass: "bg-[var(--color-success)]",
  },
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const config = columnConfig[column.id];

  return (
    <div className="flex flex-col w-72 flex-shrink-0 h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <span className={cn("text-sm", config.accentClass)}>{config.icon}</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-text)]">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--color-text-ghost)] tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-3 p-3 rounded-xl transition-all duration-300 min-h-[300px]",
          isOver
            ? "bg-[var(--color-slate)] shadow-[inset_0_0_0_1px_var(--color-ember),0_0_30px_rgba(245,158,11,0.05)]"
            : "bg-[var(--color-charcoal)]/50"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-in opacity-0"
              style={{ animationDelay: `${0.15 + index * 0.03}s` }}
            >
              <KanbanCard task={task} />
            </div>
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg border border-dashed border-[var(--color-ash)] flex items-center justify-center">
                <span className={cn("text-lg", config.accentClass)}>{config.icon}</span>
              </div>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-ghost)]">
                Drop tasks here
              </p>
            </div>
          </div>
        )}

        {/* Drop indicator */}
        {isOver && tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg border border-dashed border-[var(--color-ember)] bg-[var(--color-ember)]/5">
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-ember)]">
                Release to drop
              </p>
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <div className="mt-auto pt-2">
          <AddTaskForm columnId={column.id} />
        </div>
      </div>
    </div>
  );
}

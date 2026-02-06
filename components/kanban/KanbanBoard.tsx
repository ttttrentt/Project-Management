"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  closestCenter,
  CollisionDetection,
} from "@dnd-kit/core";
import { useKanbanStore } from "@/stores/useKanbanStore";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { KanbanTask, KanbanColumnId } from "@/types";

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return closestCenter(args);
};

export function KanbanBoard() {
  const { tasks, columns, columnOrder, moveTask } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks[active.id as string];
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks[activeId];
    if (!activeTask) return;

    const overColumn = columns[overId as KanbanColumnId];
    if (overColumn && overColumn.id !== activeTask.columnId) {
      moveTask(activeId, overColumn.id, overColumn.taskIds.length);
      return;
    }

    const overTask = tasks[overId];
    if (overTask && overTask.columnId !== activeTask.columnId) {
      const overColumnId = overTask.columnId;
      const overColumn = columns[overColumnId];
      const newIndex = overColumn.taskIds.indexOf(overId);
      moveTask(activeId, overColumnId, newIndex);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks[activeId];
    const overTask = tasks[overId];

    if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
      const columnId = activeTask.columnId;
      const taskIds = [...columns[columnId].taskIds];
      const oldIndex = taskIds.indexOf(activeId);
      const newIndex = taskIds.indexOf(overId);

      if (oldIndex !== newIndex) {
        moveTask(activeId, columnId, newIndex);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full">
        {columnOrder.map((columnId, index) => (
          <div
            key={columnId}
            className="animate-in opacity-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <KanbanColumn
              column={columns[columnId]}
              tasks={columns[columnId].taskIds
                .map((id) => tasks[id])
                .filter(Boolean)}
            />
          </div>
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && <KanbanCard task={activeTask} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  );
}

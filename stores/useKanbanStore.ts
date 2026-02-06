import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { KanbanTask, KanbanState, KanbanColumnId, KanbanColumn, KanbanPriority } from "@/types";
import { generateId } from "@/lib/utils";

interface KanbanActions {
  addTask: (columnId: KanbanColumnId, title: string, description?: string, priority?: KanbanPriority) => void;
  moveTask: (taskId: string, toColumnId: KanbanColumnId, newIndex: number) => void;
  reorderTasks: (columnId: KanbanColumnId, taskIds: string[]) => void;
  updateTask: (taskId: string, updates: Partial<Pick<KanbanTask, "title" | "description" | "priority">>) => void;
  deleteTask: (taskId: string) => void;
}

const initialState: KanbanState = {
  tasks: {},
  columns: {
    todo: { id: "todo", title: "Todo", taskIds: [] },
    "in-progress": { id: "in-progress", title: "In Progress", taskIds: [] },
    complete: { id: "complete", title: "Complete", taskIds: [] },
  },
  columnOrder: ["todo", "in-progress", "complete"],
};

export const useKanbanStore = create<KanbanState & KanbanActions>()(
  persist(
    (set) => ({
      ...initialState,

      addTask: (columnId, title, description, priority = "medium") => {
        const id = `task-${generateId()}`;
        const now = Date.now();

        set((state) => ({
          tasks: {
            ...state.tasks,
            [id]: {
              id,
              title,
              description,
              priority,
              columnId,
              createdAt: now,
              updatedAt: now,
            },
          },
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              taskIds: [...state.columns[columnId].taskIds, id],
            },
          },
        }));
      },

      moveTask: (taskId, toColumnId, newIndex) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;

          const fromColumnId = task.columnId;

          // Remove from old column
          const fromTaskIds = state.columns[fromColumnId].taskIds.filter(
            (id) => id !== taskId
          );

          // Add to new column at index
          let toTaskIds: string[];
          if (fromColumnId === toColumnId) {
            // Same column - just reorder
            toTaskIds = [...fromTaskIds];
            toTaskIds.splice(newIndex, 0, taskId);
          } else {
            // Different column
            toTaskIds = [...state.columns[toColumnId].taskIds];
            toTaskIds.splice(newIndex, 0, taskId);
          }

          return {
            tasks: {
              ...state.tasks,
              [taskId]: { ...task, columnId: toColumnId, updatedAt: Date.now() },
            },
            columns: {
              ...state.columns,
              [fromColumnId]: {
                ...state.columns[fromColumnId],
                taskIds: fromColumnId === toColumnId ? toTaskIds : fromTaskIds,
              },
              ...(fromColumnId !== toColumnId && {
                [toColumnId]: {
                  ...state.columns[toColumnId],
                  taskIds: toTaskIds,
                },
              }),
            },
          };
        });
      },

      reorderTasks: (columnId, taskIds) => {
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: { ...state.columns[columnId], taskIds },
          },
        }));
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              ...updates,
              updatedAt: Date.now(),
            },
          },
        }));
      },

      deleteTask: (taskId) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;

          const { [taskId]: removed, ...remainingTasks } = state.tasks;

          return {
            tasks: remainingTasks,
            columns: {
              ...state.columns,
              [task.columnId]: {
                ...state.columns[task.columnId],
                taskIds: state.columns[task.columnId].taskIds.filter(
                  (id) => id !== taskId
                ),
              },
            },
          };
        });
      },
    }),
    {
      name: "kanban-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

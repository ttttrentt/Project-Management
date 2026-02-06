import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TodoItem, TodoState } from "@/types";
import { generateId } from "@/lib/utils";

interface TodoActions {
  addItem: (text: string) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, text: string) => void;
}

const initialState: TodoState = {
  items: [],
};

export const useTodoStore = create<TodoState & TodoActions>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (text) => {
        const id = `todo-${generateId()}`;
        const now = Date.now();

        set((state) => ({
          items: [
            ...state.items,
            {
              id,
              text,
              completed: false,
              createdAt: now,
            },
          ],
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed ? Date.now() : undefined,
                }
              : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateItem: (id, text) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, text } : item
          ),
        }));
      },
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

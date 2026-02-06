# Vibe

A minimal, dark-themed project management board built for speed and focus. Combines a kanban board, quick-capture todo list, and notes panel in a single view — all persisted locally in the browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Features

**Kanban Board** — Drag-and-drop task cards across To Do, In Progress, and Complete columns. Tasks support priority levels (Low / Medium / High) with color-coded borders and automatic priority sorting.

**Quick Tasks** — A lightweight todo list in the sidebar for small items that don't need a full card. Check them off as you go.

**Notes** — A persistent notes panel with auto-save for jotting down ideas, meeting notes, or context that doesn't fit on a card.

**Offline-first** — Everything is stored in `localStorage` via Zustand. No accounts, no servers, no latency. Your data stays on your machine.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 16](https://nextjs.org/) (Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| State | [Zustand](https://zustand.docs.pmnd.rs/) with `persist` middleware |
| Drag & Drop | [@dnd-kit](https://dndkit.com/) (core + sortable) |
| Language | TypeScript 5 |
| Fonts | JetBrains Mono + Instrument Serif |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/projectmanagement.git
cd projectmanagement

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/
│   ├── globals.css          # Theme variables, animations, base styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main dashboard (sidebar + board + notes)
├── components/
│   ├── kanban/
│   │   ├── KanbanBoard.tsx  # DnD context, drag handlers, priority sorting
│   │   ├── KanbanColumn.tsx # Droppable column with task list
│   │   ├── KanbanCard.tsx   # Draggable card with priority border + cycling
│   │   └── AddTaskForm.tsx  # Inline task creation with priority picker
│   ├── notes/
│   │   ├── NotesPanel.tsx   # Notes sidebar wrapper
│   │   ├── NotesList.tsx    # Note tabs / selection
│   │   └── NotesEditor.tsx  # Auto-saving note editor
│   └── todo/
│       ├── TodoList.tsx     # Quick task list with pending/done sections
│       ├── TodoItem.tsx     # Individual todo with checkbox
│       └── AddTodoForm.tsx  # Inline todo input
├── stores/
│   ├── useKanbanStore.ts    # Kanban state + localStorage persistence
│   ├── useTodoStore.ts      # Todo state + localStorage persistence
│   └── useNotesStore.ts     # Notes state + localStorage persistence
├── types/
│   └── index.ts             # Shared TypeScript interfaces
└── lib/
    └── utils.ts             # cn() helper, ID generation
```

## License

MIT

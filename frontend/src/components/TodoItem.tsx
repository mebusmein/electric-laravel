import { useState } from "react";
import type { Todo } from "../api/types";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onUpdate: (id: number, title: string, description?: string) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, editTitle.trim(), editDescription.trim() || undefined);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4 transition-all duration-200 ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(todo)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              todo.completed
                ? "bg-[var(--color-success)] border-[var(--color-success)]"
                : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
            }`}
          >
            {todo.completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium ${
                todo.completed
                  ? "line-through text-[var(--color-text-muted)]"
                  : ""
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {todo.description}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleStartEdit}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


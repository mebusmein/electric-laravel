import { useState, useCallback } from "react";
import type { Label } from "../api/types";
import { useLiveQuery } from "@tanstack/react-db";
import { labelsCollection } from "../api/labels";
import { useAuth } from "../contexts/AuthContext";

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
];

export function LabelsSidebar() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[0]);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const { user } = useAuth();

  const { data: labels } = useLiveQuery((q) =>
    q.from({ labels: labelsCollection })
  );

  const handleCreateLabel = useCallback(() => {
    if (!newLabelName.trim()) return;

    labelsCollection.insert({
      id: Math.floor(Math.random() * 1000000),
      user_id: user?.id ?? 0,
      name: newLabelName.trim(),
      color: newLabelColor,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setNewLabelName("");
    setNewLabelColor(PRESET_COLORS[0]);
    setIsCreating(false);
  }, [newLabelName, newLabelColor, user?.id]);

  const handleStartEdit = useCallback((label: Label) => {
    setEditingId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editName.trim() || editingId === null) return;

    labelsCollection.update(editingId, (draft) => {
      draft.name = editName.trim();
      draft.color = editColor;
    });
    setEditingId(null);
    setEditName("");
    setEditColor("");
  }, [editingId, editName, editColor]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  }, []);

  const handleDeleteLabel = useCallback((id: number) => {
    labelsCollection.delete(id);
  }, []);

  return (
    <aside className="w-64 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Labels
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors p-1"
          title="Add label"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Create new label form */}
      {isCreating && (
        <div className="mb-4 p-3 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)]">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name"
            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[var(--color-accent)]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateLabel();
              if (e.key === "Escape") setIsCreating(false);
            }}
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewLabelColor(color)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  newLabelColor === color
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--color-bg-tertiary)] scale-110"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateLabel}
              disabled={!newLabelName.trim()}
              className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm py-1.5 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewLabelName("");
              }}
              className="flex-1 bg-[var(--color-bg-primary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] text-sm py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Labels list */}
      <div className="space-y-1">
        {labels.length === 0 && !isCreating && (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
            No labels yet
          </p>
        )}

        {labels.map((label) =>
          editingId === label.id ? (
            <div
              key={label.id}
              className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)]"
            >
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[var(--color-accent)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      editColor === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--color-bg-tertiary)] scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editName.trim()}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm py-1.5 rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-[var(--color-bg-primary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] text-sm py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={label.id}
              className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: label.color }}
              />
              <span className="flex-1 text-sm truncate">{label.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(label);
                  }}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  title="Edit label"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLabel(label.id);
                  }}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                  title="Delete label"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
          )
        )}
      </div>
    </aside>
  );
}

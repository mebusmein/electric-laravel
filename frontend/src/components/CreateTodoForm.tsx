import { useState } from "react";

interface CreateTodoFormProps {
  onCreate: (title: string, description?: string) => Promise<void>;
}

export function CreateTodoForm({ onCreate }: CreateTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await onCreate(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-6 py-4 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add new task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        autoFocus
        className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent mb-3"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent mb-3 resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating || !title.trim()}
          className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Adding..." : "Add task"}
        </button>
      </div>
    </form>
  );
}


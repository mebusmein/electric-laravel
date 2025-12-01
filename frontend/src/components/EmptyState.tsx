interface EmptyStateProps {
  type: "no-tasks" | "no-results";
  searchQuery?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  type,
  searchQuery,
  onClearFilters,
}: EmptyStateProps) {
  if (type === "no-tasks") {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-4">
          <svg
            className="w-8 h-8 text-[var(--color-text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
        <p className="text-[var(--color-text-muted)]">
          Add your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-4">
        <svg
          className="w-8 h-8 text-[var(--color-text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-1">No matching tasks</h3>
      <p className="text-[var(--color-text-muted)]">
        {searchQuery
          ? `No tasks match "${searchQuery}"`
          : "All tasks are completed"}
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-3 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium text-sm"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}


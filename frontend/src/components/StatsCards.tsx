interface StatsCardsProps {
  total: number;
  pending: number;
  completed: number;
}

export function StatsCards({ total, pending, completed }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-sm text-[var(--color-text-muted)]">Total tasks</p>
      </div>
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
        <p className="text-2xl font-bold text-amber-400">{pending}</p>
        <p className="text-sm text-[var(--color-text-muted)]">Pending</p>
      </div>
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
        <p className="text-2xl font-bold text-[var(--color-success)]">
          {completed}
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">Completed</p>
      </div>
    </div>
  );
}


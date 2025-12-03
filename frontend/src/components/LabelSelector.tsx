import { useState, useRef, useEffect } from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { labelsCollection } from "../api/labels";

interface LabelSelectorProps {
  selectedLabelIds: number[];
  onChange: (labelIds: number[]) => void;
  compact?: boolean;
}

export function LabelSelector({
  selectedLabelIds,
  onChange,
  compact = false,
}: LabelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: allLabels } = useLiveQuery((q) =>
    q.from({ labels: labelsCollection })
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLabel = (labelId: number) => {
    if (selectedLabelIds.includes(labelId)) {
      onChange(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      onChange([...selectedLabelIds, labelId]);
    }
  };

  const selectedLabels = allLabels.filter((label) =>
    selectedLabelIds.includes(label.id)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-colors ${
          compact ? "text-sm" : ""
        }`}
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        {selectedLabels.length === 0 ? (
          <span>Labels</span>
        ) : (
          <span>{selectedLabels.length} selected</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Selected labels badges */}
      {selectedLabels.length > 0 && !compact && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedLabels.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
                border: `1px solid ${label.color}40`,
              }}
              onClick={() => toggleLabel(label.id)}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
              <svg
                className="w-3 h-3 ml-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden">
          {allLabels.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
              No labels available
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto py-1">
              {allLabels.map((label) => {
                const isSelected = selectedLabelIds.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
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
                    </div>
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm text-[var(--color-text-primary)] truncate">
                      {label.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


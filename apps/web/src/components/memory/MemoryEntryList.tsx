'use client';

import { useMemo, useState } from 'react';
import type { MemoryEntryDTO } from '../../lib/types';
import { MemoryEntryCard } from './MemoryEntryCard';

type MemoryEntryListProps = {
  initialEntries: MemoryEntryDTO[];
  emptyMessage: string;
  limit?: number;
};

function sortEntries(entries: MemoryEntryDTO[]) {
  return [...entries].sort((left, right) => {
    const pinnedDelta = Number(right.pinned === true) - Number(left.pinned === true);
    if (pinnedDelta !== 0) {
      return pinnedDelta;
    }

    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

export function MemoryEntryList({ initialEntries, emptyMessage, limit }: MemoryEntryListProps) {
  const [entries, setEntries] = useState(() => sortEntries(initialEntries));

  const visibleEntries = useMemo(() => {
    const sorted = sortEntries(entries);
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }, [entries, limit]);

  if (!visibleEntries.length) {
    return <p style={{ margin: 0 }}>{emptyMessage}</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {visibleEntries.map((entry) => (
        <MemoryEntryCard
          key={entry.id}
          item={entry}
          onUpdated={(updatedEntry) => {
            setEntries((current) => sortEntries(current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))));
          }}
          onDeleted={(deletedEntryId) => {
            setEntries((current) => current.filter((entry) => entry.id !== deletedEntryId));
          }}
        />
      ))}
    </div>
  );
}

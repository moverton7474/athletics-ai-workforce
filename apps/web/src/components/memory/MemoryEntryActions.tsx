'use client';

import { useState } from 'react';
import { deleteMemoryEntry, updateMemoryEntry } from '../../lib/browser-actions';
import type { MemoryEntryDTO } from '../../lib/types';

type MemoryEntryActionsProps = {
  item: MemoryEntryDTO;
  onUpdated?: (entry: MemoryEntryDTO) => void;
  onDeleted?: (memoryEntryId: string) => void;
};

export function MemoryEntryActions({ item, onUpdated, onDeleted }: MemoryEntryActionsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(item.summary ?? '');
  const [content, setContent] = useState(item.content);
  const [tags, setTags] = useState(item.tags.join(', '));
  const [pinned, setPinned] = useState(item.pinned === true);

  async function saveChanges(nextPinned: boolean) {
    const result = await updateMemoryEntry(item.id, {
      taskId: item.taskId ?? undefined,
      approvalId: item.approvalId ?? undefined,
      summary,
      content,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      pinned: nextPinned,
    });

    setMessage(result.message);

    if (result.success && result.entry) {
      setPinned(result.entry.pinned === true);
      setSummary(result.entry.summary ?? '');
      setContent(result.entry.content);
      setTags(result.entry.tags.join(', '));
      onUpdated?.(result.entry);
    }

    return result;
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={async () => {
            const result = await saveChanges(!pinned);
            if (result.success) {
              setPinned((current) => !current);
            }
          }}
        >
          {pinned ? 'Unpin' : 'Pin'}
        </button>
        <button type="button" onClick={() => setIsEditing((current) => !current)}>
          {isEditing ? 'Close Editor' : 'Edit'}
        </button>
        <button
          type="button"
          onClick={async () => {
            const confirmed = window.confirm('Delete this memory entry?');
            if (!confirmed) {
              return;
            }

            const result = await deleteMemoryEntry(item.id);
            setMessage(result.message);
            if (result.success) {
              onDeleted?.(item.id);
            }
          }}
        >
          Delete
        </button>
      </div>

      {isEditing ? (
        <form
          style={{ display: 'grid', gap: 10, border: '1px solid #eee', borderRadius: 12, padding: 12 }}
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await saveChanges(pinned);
            if (result.success) {
              setIsEditing(false);
            }
          }}
        >
          <label>
            Summary
            <input type="text" value={summary} onChange={(event) => setSummary(event.target.value)} />
          </label>
          <label>
            Content
            <textarea rows={4} value={content} onChange={(event) => setContent(event.target.value)} />
          </label>
          <label>
            Tags
            <input type="text" value={tags} onChange={(event) => setTags(event.target.value)} />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      ) : null}

      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </div>
  );
}

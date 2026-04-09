'use client';

import { useState } from 'react';
import { addMemoryEntry } from '../../lib/browser-actions';

export function MemoryCaptureForm({
  workers,
}: {
  workers: Array<{ id: string; name: string; roleName: string }>;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 720 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const rawTags = String(form.get('tags') || '');
        const result = await addMemoryEntry({
          memoryType: String(form.get('memoryType') || ''),
          visibilityScope: String(form.get('visibilityScope') || 'organization'),
          workerId: String(form.get('workerId') || ''),
          summary: String(form.get('summary') || ''),
          content: String(form.get('content') || ''),
          tags: rawTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        });
        setMessage(result.message);
        if (result.success) {
          event.currentTarget.reset();
        }
      }}
    >
      <label>
        Memory Type
        <select name="memoryType" defaultValue="handoff">
          <option value="handoff">Handoff</option>
          <option value="decision">Decision</option>
          <option value="signal">Signal</option>
          <option value="preference">Preference</option>
          <option value="process">Process</option>
        </select>
      </label>
      <label>
        Visibility Scope
        <select name="visibilityScope" defaultValue="organization">
          <option value="organization">Organization</option>
          <option value="personal">Personal</option>
        </select>
      </label>
      <label>
        Worker Context
        <select name="workerId" defaultValue="">
          <option value="">No specific worker</option>
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name} — {worker.roleName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Summary
        <input type="text" name="summary" placeholder="One-line handoff or reminder" />
      </label>
      <label>
        Detailed Context
        <textarea name="content" placeholder="Capture what changed, what matters, and what should survive a context reset." rows={5} />
      </label>
      <label>
        Tags
        <input type="text" name="tags" placeholder="approvals, sponsorship, follow-up" />
      </label>
      <button type="submit">Save Memory Entry</button>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </form>
  );
}

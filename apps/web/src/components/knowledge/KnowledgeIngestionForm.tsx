'use client';

import { useState } from 'react';
import { addKnowledgeItem } from '../../lib/browser-actions';

export function KnowledgeIngestionForm() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 640, marginBottom: 24 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const result = await addKnowledgeItem({
          title: String(form.get('title') || ''),
          sourceType: String(form.get('sourceType') || ''),
          sourceUrl: String(form.get('sourceUrl') || ''),
          content: String(form.get('content') || ''),
          scope: String(form.get('scope') || 'organization'),
        });
        setMessage(result.message);
      }}
    >
      <label>
        Title
        <input type="text" name="title" placeholder="KSU Brand Guidelines" />
      </label>
      <label>
        Scope
        <select name="scope" defaultValue="organization">
          <option value="organization">Organization Memory</option>
          <option value="worker">Worker Memory</option>
          <option value="personal">Personal Memory</option>
        </select>
      </label>
      <label>
        Source Type
        <select name="sourceType" defaultValue="document">
          <option value="document">Document</option>
          <option value="webpage">Webpage</option>
          <option value="image">Image</option>
          <option value="memory">Memory</option>
        </select>
      </label>
      <label>
        URL / Reference
        <input type="text" name="sourceUrl" placeholder="https://example.com/resource" />
      </label>
      <label>
        Content Notes
        <textarea name="content" placeholder="Optional summary or ingestion notes" />
      </label>
      <button type="submit">Add Knowledge Item</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

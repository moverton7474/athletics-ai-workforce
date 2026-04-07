'use client';

import { useState } from 'react';

export function KnowledgeIngestionForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 640, marginBottom: 24 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label>
        Title
        <input type="text" name="title" placeholder="KSU Brand Guidelines" />
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
      {submitted ? <p>Knowledge item submitted locally (stub).</p> : null}
    </form>
  );
}

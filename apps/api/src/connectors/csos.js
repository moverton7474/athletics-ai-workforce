export async function runCsosCommand({ command, args = [] }) {
  // Stub for future CLI-based CSOS execution.
  // In production this should enforce policy checks, capture stdout/stderr,
  // normalize outputs, and write connector run records.
  return {
    command,
    args,
    status: 'stubbed',
    output: null,
  };
}

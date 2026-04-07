export function createConnectorRunLog({ connectorName, workerId, status, input, output, errorText }) {
  return {
    id: crypto.randomUUID(),
    connectorName,
    workerId,
    status,
    input,
    output,
    errorText,
    createdAt: new Date().toISOString(),
  };
}

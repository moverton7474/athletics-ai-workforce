import { voiceCommandRegistry } from './voice-command-registry.js';

export function matchVoiceIntent(utterance) {
  const normalized = utterance.trim().toLowerCase();
  return (
    voiceCommandRegistry.find((intent) =>
      intent.exampleUtterances.some((example) => normalized.includes(example.toLowerCase()))
    ) || null
  );
}

export async function routeVoiceCommand(utterance) {
  const intent = matchVoiceIntent(utterance);

  if (!intent) {
    return {
      success: false,
      intentCode: 'unknown',
      actionType: 'none',
      message: 'No matching voice intent found.',
    };
  }

  return {
    success: true,
    intentCode: intent.code,
    actionType: intent.actionType,
    message: `Matched intent: ${intent.label}`,
  };
}

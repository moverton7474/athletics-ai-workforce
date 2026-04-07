export type VoiceIntent = {
  code: string;
  label: string;
  workerRole: string;
  exampleUtterances: string[];
  actionType: string;
};

export type VoiceActionResult = {
  success: boolean;
  intentCode: string;
  actionType: string;
  message: string;
};

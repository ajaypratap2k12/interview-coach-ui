export interface ChatMessage {
  id: string;
  role: 'system' | 'question' | 'answer' | 'feedback';
  content: string;
  score?: number;
  timestamp: Date;
  trace?: TraceResponse;
  __traceOpen?: boolean;
}

export interface NodeTrace {
  nodeName: string;
  durationMs: number;
  startedAt: string;
  endedAt: string;
}

export interface TraceResponse {
  question: string;
  plannerOutput: string;
  executionPlan: string[];
  nodeTraces: NodeTrace[];
  aggregatorOutput: string;
  evaluatorScore: number;
  evaluatorFeedback: string;
  totalDurationMs: number;
}

export interface StartSessionResponse {
  sessionId: string;
  currentQuestion: string;
}

export interface AnswerRequest {
  sessionId: string;
  currentQuestion: string;
  candidateAnswer: string;
}

export interface AnswerResponse {
  feedback: string;
  score: number;
  nextQuestion: string;
}

export interface AskQuestionResponse {
  question: string;
  finalAnswer: string;
}

export interface RoleConfig {
  label: string;
  icon: string;
  align: 'left' | 'right' | 'center';
  variant: 'default' | 'primary' | 'accent' | 'system';
}

export const INTERVIEW_ROLES: Record<string, RoleConfig> = {
  system:   { label: 'System',     icon: '🤖', align: 'center', variant: 'system' },
  question: { label: 'Interviewer', icon: '🎤', align: 'left',   variant: 'default' },
  answer:   { label: 'You',        icon: '👤', align: 'left',   variant: 'primary' },
  feedback: { label: 'Evaluation', icon: '📊', align: 'left',   variant: 'accent' },
};

export const ASK_ROLES: Record<string, RoleConfig> = {
  system:   { label: 'System',       icon: '🤖', align: 'center', variant: 'system' },
  question: { label: 'Expert Answer', icon: '💡', align: 'left',   variant: 'default' },
  answer:   { label: 'Your Question', icon: '👤', align: 'left',   variant: 'primary' },
};

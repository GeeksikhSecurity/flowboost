export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  microSteps: MicroStep[];
}

export interface MicroStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  isBreak: boolean;
}

export interface UserPreferences {
  procrastinationFrequency?: string;
  biggestChallenge?: string;
  workBreakdownPreference?: string;
  focusSessionDuration?: number;
  breakDuration?: number;
  theme?: 'light' | 'dark' | 'system';
}

export interface UserSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  totalFocusTime: number;
  tasksCompleted: number;
  microstepsCompleted: number;
}

export interface UserEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: string;
  eventData: any;
  createdAt: string;
}
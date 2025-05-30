export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  microSteps: MicroStep[];
  category?: string;
  energyLevel?: 'Low' | 'Medium' | 'High';
  completedAt?: string;
}

export interface MicroStep {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  isBreak: boolean;
}

export interface UserPreferences {
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading/Writing';
  breakdownDepth: 'Minimal' | 'Moderate' | 'Detailed';
  focusSessionDuration: number;
  breakDuration: number;
  preferredCategories: string[];
  energyPatterns: {
    morning: 'Low' | 'Medium' | 'High';
    afternoon: 'Low' | 'Medium' | 'High';
    evening: 'Low' | 'Medium' | 'High';
  };
  notificationPreferences: {
    sound: boolean;
    visual: boolean;
    reminders: boolean;
  };
}
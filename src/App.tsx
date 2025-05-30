import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { AddTask } from './components/AddTask';
import { Celebration } from './components/Celebration';
import { FeedbackButton } from './components/FeedbackButton';
import { Brain } from 'lucide-react';
import { useEngagementTracking } from './hooks/useEngagementTracking';
import type { Task } from './types';

const ENCOURAGING_MESSAGES = [
  "You've got this! Take the first step.",
  "Remember: progress over perfection.",
  "Small steps lead to big achievements.",
  "Focus on what matters most.",
  "Every minute of focus counts!"
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [message] = useState(() => 
    ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]
  );
  const { trackEvent } = useEngagementTracking();

  const handleAddTask = React.useCallback((newTask: Omit<Task, 'id' | 'completed'>) => {
    const task = { ...newTask, id: crypto.randomUUID(), completed: false };
    setTasks(prev => [...prev, task]);
    trackEvent('task_created', { taskId: task.id, title: task.title });
  }, [trackEvent]);

  const handleTaskComplete = React.useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        if (completed) {
          setCelebration('Task completed! Keep up the great work! 🎉');
          trackEvent('task_completed', { taskId, title: task.title });
        }
        return { ...task, completed };
      }
      return task;
    }));
  }, [trackEvent]);

  const handleMicroStepComplete = React.useCallback((taskId: string, stepId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.microSteps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        if (updatedSteps.some(step => step.id === stepId && step.completed)) {
          setCelebration('Micro-step completed! Progress feels good! ⭐');
          trackEvent('microstep_completed', { 
            taskId,
            stepId,
            taskTitle: task.title,
            stepTitle: task.microSteps.find(s => s.id === stepId)?.title
          });
        }
        return { ...task, microSteps: updatedSteps };
      }
      return task;
    }));
  }, [trackEvent]);

  const handleTaskDelete = React.useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        trackEvent('task_deleted', { taskId, title: task.title });
      }
      return prev.filter(task => task.id !== taskId);
    });
  }, [trackEvent]);

  const handleSessionComplete = React.useCallback(() => {
    setCelebration('Focus session completed! Time for a refreshing break! 🌟');
    trackEvent('focus_session_completed', {
      completedTasks: tasks.filter(t => t.completed).length,
      totalTasks: tasks.length
    });
  }, [tasks, trackEvent]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">FlowBoost</h1>
          </div>
          <div className="space-y-2">
            <p className="text-xl text-indigo-600 font-medium">Break Tasks Down, Build Success Up</p>
            <p className="text-lg text-gray-600 italic">{message}</p>
          </div>
        </header>

        <div className="grid gap-8">
          <Timer onSessionComplete={handleSessionComplete} />
          
          <div className="space-y-4">
            <AddTask onAddTask={handleAddTask} />
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              onMicroStepComplete={handleMicroStepComplete}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        </div>
      </div>

      {celebration && (
        <Celebration
          message={celebration}
          onClose={() => setCelebration(null)}
        />
      )}
      
      <FeedbackButton />
    </div>
  );
}
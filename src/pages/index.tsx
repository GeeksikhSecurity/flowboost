import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

import { Timer } from '@/components/Timer';
import { TaskList } from '@/components/TaskList';
import { AddTask } from '@/components/AddTask';
import { Celebration } from '@/components/Celebration';
import { FeedbackButton } from '@/components/FeedbackButton';
import { Onboarding } from '@/components/Onboarding';
import type { Task } from '@/types';

const ENCOURAGING_MESSAGES = [
  "You've got this! Take the first step.",
  "Remember: progress over perfection.",
  "Small steps lead to big achievements.",
  "Focus on what matters most.",
  "Every minute of focus counts!"
];

export default function Home() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [message] = useState(() => 
    ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user needs onboarding when they sign in
    if (session?.user) {
      fetch('/api/user/preferences')
        .then(res => res.json())
        .then(data => {
          if (Object.keys(data.preferences || {}).length === 0) {
            setShowOnboarding(true);
          }
        })
        .catch(err => console.error('Error checking preferences:', err));
    }
  }, [session]);
  
  const trackEvent = async (eventType: string, eventData = {}) => {
    if (!session?.user) return;
    
    try {
      await fetch('/api/user/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventData })
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };
  
  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task = { ...newTask, id: crypto.randomUUID(), completed: false };
    setTasks(prev => [...prev, task]);
    trackEvent('task_created', { taskId: task.id, title: task.title });
  };
  
  const handleTaskComplete = (taskId: string) => {
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
  };
  
  const handleMicroStepComplete = (taskId: string, stepId: string) => {
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
  };
  
  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        trackEvent('task_deleted', { taskId, title: task.title });
      }
      return prev.filter(task => task.id !== taskId);
    });
  };
  
  const handleSessionComplete = () => {
    setCelebration('Focus session completed! Time for a refreshing break! 🌟');
    trackEvent('focus_session_completed', {
      completedTasks: tasks.filter(t => t.completed).length,
      totalTasks: tasks.length
    });
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Brain className="w-16 h-16 text-primary-600 mb-4" />
          <h2 className="text-xl font-medium text-gray-600">Loading FlowBoost AI...</h2>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Head>
          <title>FlowBoost AI - Break Tasks Down, Build Success Up</title>
        </Head>
        
        <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-16 h-16 text-primary-600" />
              <h1 className="text-5xl font-bold text-gray-900">FlowBoost AI</h1>
            </div>
            <p className="text-2xl text-primary-600 font-medium mb-2">Break Tasks Down, Build Success Up</p>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Your AI-powered personal coach to overcome perfectionism, boost productivity, and achieve flow state.
            </p>
          </motion.div>
          
          <motion.div 
            className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Get Started</h2>
            <p className="text-gray-600 mb-6 text-center">
              Sign in to start your journey to improved focus and productivity.
            </p>
            
            <button
              onClick={() => signIn('google')}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            
            <button
              onClick={() => signIn('email')}
              className="btn-secondary w-full"
            >
              Sign in with Email
            </button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>FlowBoost AI - Your Productivity Dashboard</title>
      </Head>
      
      {showOnboarding ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">FlowBoost AI</h1>
            </div>
            <div className="space-y-2">
              <p className="text-xl text-primary-600 font-medium">Break Tasks Down, Build Success Up</p>
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
      )}

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
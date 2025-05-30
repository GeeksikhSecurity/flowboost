import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface TimerProps {
  onSessionComplete: () => void;
  initialDuration?: number;
  breakDuration?: number;
}

export function Timer({ 
  onSessionComplete, 
  initialDuration = 25 * 60, // 25 minutes in seconds
  breakDuration = 5 * 60 // 5 minutes in seconds
}: TimerProps) {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const resetTimer = useCallback(() => {
    setTimeLeft(isBreak ? breakDuration : initialDuration);
    setIsRunning(false);
  }, [isBreak, breakDuration, initialDuration]);
  
  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
    
    // Track event
    if (session?.user) {
      fetch('/api/user/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventType: !isRunning ? 'timer_start' : 'timer_pause',
          eventData: { isBreak }
        })
      }).catch(err => console.error('Failed to track event:', err));
    }
  }, [isRunning, isBreak, session]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      if (isBreak) {
        // Break finished, start work session
        setIsBreak(false);
        setTimeLeft(initialDuration);
      } else {
        // Work session finished, start break
        setIsBreak(true);
        setTimeLeft(breakDuration);
        onSessionComplete();
        
        // Track session completion
        if (session?.user) {
          fetch('/api/user/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              eventType: 'focus_session_completed',
              eventData: { duration: initialDuration }
            })
          }).catch(err => console.error('Failed to track event:', err));
        }
      }
      
      // Play sound notification
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, initialDuration, breakDuration, onSessionComplete, session]);
  
  const progress = (timeLeft / (isBreak ? breakDuration : initialDuration)) * 100;
  
  return (
    <div className="card">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {isBreak ? 'Break Time' : 'Focus Session'}
        </h2>
        
        <div className="relative w-48 h-48 mx-auto my-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isBreak ? "#10b981" : "#4f46e5"}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <motion.button
            onClick={toggleTimer}
            className="btn-primary flex items-center justify-center w-12 h-12 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>
          
          <motion.button
            onClick={resetTimer}
            className="btn-secondary flex items-center justify-center w-12 h-12 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
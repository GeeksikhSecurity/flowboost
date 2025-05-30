import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings2, Volume2, VolumeX } from 'lucide-react';
import type { UserPreferences } from '../types';

interface AdaptiveTimerProps {
  userPreferences: UserPreferences;
  onSessionComplete: () => void;
}

export function AdaptiveTimer({ userPreferences, onSessionComplete }: AdaptiveTimerProps) {
  const [timeLeft, setTimeLeft] = useState(userPreferences.focusSessionDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(userPreferences.notificationPreferences.sound);
  const [showSettings, setShowSettings] = useState(false);
  const [customDuration, setCustomDuration] = useState(userPreferences.focusSessionDuration);
  const [customBreak, setCustomBreak] = useState(userPreferences.breakDuration);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      
      // Play sound notification if enabled
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
      
      // Show visual notification
      if (userPreferences.notificationPreferences.visual) {
        // Request permission for browser notifications if needed
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
        
        // Show notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(isBreak ? 'Break Complete!' : 'Focus Session Complete!', {
            body: isBreak ? 'Time to get back to work!' : 'Great job! Take a short break.',
            icon: '/logo.png'
          });
        }
      }
      
      if (!isBreak) {
        onSessionComplete();
      }
      
      // Toggle between work and break
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 
        customDuration * 60 : 
        customBreak * 60
      );
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, onSessionComplete, soundEnabled, customDuration, customBreak, userPreferences]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customDuration * 60);
    setIsBreak(false);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  const applyCustomSettings = () => {
    setTimeLeft(isBreak ? customBreak * 60 : customDuration * 60);
    setShowSettings(false);
  };

  // Calculate progress percentage for the progress ring
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const progressPercentage = isBreak 
    ? 1 - (timeLeft / (customBreak * 60))
    : 1 - (timeLeft / (customDuration * 60));
  const strokeDashoffset = circumference * (1 - progressPercentage);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative">
      <h2 className="text-2xl font-bold mb-6">
        {isBreak ? 'Take a Break!' : 'Focus Session'}
      </h2>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isBreak ? "#10b981" : "#6366f1"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold text-gray-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            isBreak 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleSound}
          className="p-2 rounded-full hover:bg-gray-100"
          title={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Timer settings"
        >
          <Settings2 size={20} />
        </button>
      </div>
      
      {showSettings && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Customize Timer</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Focus (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={customBreak}
                onChange={(e) => setCustomBreak(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            onClick={applyCustomSettings}
            className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-md"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
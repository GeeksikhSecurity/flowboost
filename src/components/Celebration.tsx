import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ThumbsUp, Smile } from 'lucide-react';

interface CelebrationProps {
  type: 'task' | 'session' | 'streak';
  message?: string;
  onClose: () => void;
}

export function Celebration({ type, message, onClose }: CelebrationProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Trigger confetti effect
    const duration = 2000;
    const end = Date.now() + duration;
    
    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981'];
    
    // Different confetti patterns based on celebration type
    if (type === 'task') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors
      });
    } else if (type === 'session') {
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
      }, 250);
      
      return () => clearInterval(interval);
    } else if (type === 'streak') {
      // Fire star-shaped confetti
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 30,
        colors
      };
      
      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star']
        });
        
        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle']
        });
      }
      
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    }
    
    // Auto-hide after animation
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Allow fade-out animation to complete
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [type, onClose]);
  
  // Different icons based on celebration type
  const renderIcon = () => {
    switch (type) {
      case 'task':
        return <ThumbsUp className="text-indigo-500" size={32} />;
      case 'session':
        return <Star className="text-amber-500" size={32} />;
      case 'streak':
        return <Trophy className="text-amber-500" size={32} />;
      default:
        return <Smile className="text-indigo-500" size={32} />;
    }
  };
  
  // Default messages if none provided
  const getDefaultMessage = () => {
    switch (type) {
      case 'task':
        return 'Task completed! Great job!';
      case 'session':
        return 'Focus session complete! Take a well-deserved break.';
      case 'streak':
        return 'Amazing streak! You're building momentum!';
      default:
        return 'Great progress!';
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 transform transition-transform duration-300 scale-110">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {renderIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {type === 'task' && 'Well done!'}
            {type === 'session' && 'Focus Complete!'}
            {type === 'streak' && 'Awesome Streak!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message || getDefaultMessage()}
          </p>
          
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
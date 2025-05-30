import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    question: "How often do you find yourself procrastinating due to perfectionism?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"]
  },
  {
    id: 2,
    question: "What's your biggest challenge when starting tasks?",
    options: ["Fear of failure", "Overwhelm from large tasks", "Difficulty prioritizing", "Lack of motivation"]
  },
  {
    id: 3,
    question: "How do you prefer to break down your work?",
    options: ["Time blocks", "Small achievable tasks", "Project phases", "I don't usually break down tasks"]
  }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAnswer = async (answer: string) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save user preferences
      setIsSubmitting(true);
      try {
        if (session?.user) {
          const response = await fetch('/api/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences: newAnswers })
          });
          
          if (!response.ok) throw new Error('Failed to save preferences');
        }
        onComplete();
      } catch (error) {
        console.error('Error saving preferences:', error);
        onComplete(); // Continue anyway
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const question = QUESTIONS[currentQuestion];
  
  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {QUESTIONS.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-full mx-1 rounded-full ${
                index <= currentQuestion ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
      </div>
      
      <motion.h2 
        className="text-2xl font-bold mb-6"
        key={question.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {question.question}
      </motion.h2>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <motion.button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-4 border rounded-lg hover:bg-primary-50 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
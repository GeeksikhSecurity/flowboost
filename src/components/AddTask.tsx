import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTaskSuggestions } from '@/lib/ai';
import { useSession } from 'next-auth/react';
import type { MicroStep } from '@/types';

interface AddTaskProps {
  onAddTask: (task: { title: string; priority: 'High' | 'Medium' | 'Low'; microSteps: MicroStep[] }) => void;
}

export function AddTask({ onAddTask }: AddTaskProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [newStep, setNewStep] = useState('');
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onAddTask({
      title: title.trim(),
      priority,
      microSteps,
    });
    
    // Reset form
    setTitle('');
    setPriority('Medium');
    setMicroSteps([]);
    setIsOpen(false);
  };
  
  const addMicroStep = () => {
    if (!newStep.trim()) return;
    
    setMicroSteps(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: newStep.trim(), completed: false }
    ]);
    
    setNewStep('');
  };
  
  const removeMicroStep = (id: string) => {
    setMicroSteps(prev => prev.filter(step => step.id !== id));
  };
  
  const generateSteps = async () => {
    if (!title.trim() || !session?.user) return;
    
    setIsGeneratingSteps(true);
    
    try {
      const response = await fetch('/api/ai/task-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: title })
      });
      
      if (!response.ok) throw new Error('Failed to generate suggestions');
      
      const data = await response.json();
      
      if (data.suggestions) {
        // Parse suggestions from AI response
        const suggestions = data.suggestions
          .split(/\\d+\\.\\s+/)
          .filter(Boolean)
          .map(step => step.trim())
          .filter(step => step.length > 0);
        
        const newMicroSteps = suggestions.map(step => ({
          id: crypto.randomUUID(),
          title: step,
          completed: false
        }));
        
        setMicroSteps(prev => [...prev, ...newMicroSteps]);
      }
    } catch (error) {
      console.error('Error generating steps:', error);
    } finally {
      setIsGeneratingSteps(false);
    }
  };
  
  return (
    <div className="card">
      {!isOpen ? (
        <motion.button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="What do you need to accomplish?"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="input-field"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="microSteps" className="block text-sm font-medium text-gray-700">
                  Break it down (Micro-steps)
                </label>
                {session?.user && (
                  <button
                    type="button"
                    onClick={generateSteps}
                    disabled={!title.trim() || isGeneratingSteps}
                    className="text-xs text-primary-600 hover:text-primary-800 disabled:text-gray-400"
                  >
                    {isGeneratingSteps ? 'Generating...' : 'Generate with AI'}
                  </button>
                )}
              </div>
              
              <div className="space-y-2 mb-2">
                <AnimatePresence>
                  {microSteps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="flex-1 text-sm bg-gray-50 p-2 rounded-md">
                        {step.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMicroStep(step.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  id="microSteps"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a small step"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMicroStep();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addMicroStep}
                  className="btn-secondary"
                  disabled={!newStep.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!title.trim()}
              >
                Create Task
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}
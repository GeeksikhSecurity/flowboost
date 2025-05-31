import { useState } from 'react';
import { Plus, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestBreakdown } from '@/lib/templates/taskBreakdown';
import type { MicroStep } from '@/types';

interface AddTaskProps {
  onAddTask: (task: { title: string; priority: 'High' | 'Medium' | 'Low'; microSteps: MicroStep[] }) => void;
}

export function AddTask({ onAddTask }: AddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState('general');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [newStep, setNewStep] = useState('');
  const [suggestedSteps, setSuggestedSteps] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
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
    setShowSuggestions(false);
  };
  
  const addMicroStep = () => {
    if (!newStep.trim()) return;
    
    setMicroSteps(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: newStep.trim(), completed: false }
    ]);
    
    setNewStep('');
  };
  
  const addSuggestedStep = (step: string) => {
    setMicroSteps(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: step, completed: false }
    ]);
  };
  
  const removeMicroStep = (id: string) => {
    setMicroSteps(prev => prev.filter(step => step.id !== id));
  };
  
  const handleGetSuggestions = () => {
    const suggestions = suggestBreakdown(title, taskType);
    setSuggestedSteps(suggestions);
    setShowSuggestions(true);
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
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Type
                </label>
                <select
                  id="taskType"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="input-field"
                >
                  <option value="general">General Task</option>
                  <option value="writing">Writing Task</option>
                  <option value="project">Project Planning</option>
                  <option value="study">Study Session</option>
                  <option value="email">Email Task</option>
                  <option value="meeting">Meeting Prep</option>
                </select>
              </div>
              
              <div className="flex-1">
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
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="microSteps" className="block text-sm font-medium text-gray-700">
                  Break it down (Micro-steps)
                </label>
                <button
                  type="button"
                  onClick={handleGetSuggestions}
                  disabled={!title.trim()}
                  className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-800 disabled:text-gray-400"
                >
                  <Lightbulb size={14} />
                  <span>Suggest Steps</span>
                </button>
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
            
            {showSuggestions && suggestedSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-primary-50 p-3 rounded-md border border-primary-100"
              >
                <h4 className="text-sm font-medium text-primary-700 mb-2">Suggested Steps:</h4>
                <div className="space-y-1">
                  {suggestedSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addSuggestedStep(step)}
                        className="text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 px-2 py-1 rounded"
                      >
                        Add
                      </button>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
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
import { useState } from 'react';
import { Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onMicroStepComplete: (taskId: string, stepId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskComplete, onMicroStepComplete, onTaskDelete }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  
  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onTaskComplete(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.completed 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 hover:border-primary-600'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  {task.microSteps.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {task.microSteps.filter(step => step.completed).length} / {task.microSteps.length} steps
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {task.microSteps.length > 0 && (
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {expandedTasks[task.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
                
                <button
                  onClick={() => onTaskDelete(task.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {task.microSteps.length > 0 && expandedTasks[task.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pl-9 space-y-2"
              >
                {task.microSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <button
                      onClick={() => onMicroStepComplete(task.id, step.id)}
                      className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'border-gray-300 hover:border-primary-600'
                      }`}
                    >
                      {step.completed && <Check size={10} />}
                    </button>
                    
                    <span className={`text-sm ${step.completed ? 'line-through text-gray-500' : ''}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
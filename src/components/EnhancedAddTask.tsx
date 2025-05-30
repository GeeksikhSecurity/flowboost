import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { AITaskBreakdown } from './AITaskBreakdown';
import type { Task, UserPreferences } from '../types';

interface EnhancedAddTaskProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  userPreferences: UserPreferences;
}

export function EnhancedAddTask({ onAddTask, userPreferences }: EnhancedAddTaskProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [category, setCategory] = useState('');
  const [energyLevel, setEnergyLevel] = useState<Task['energyLevel']>('Medium');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAIBreakdown, setShowAIBreakdown] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(
    userPreferences.preferredCategories || ['Work', 'Personal', 'Learning', 'Health']
  );
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      priority,
      category: category || undefined,
      energyLevel,
      microSteps: [] // Will be populated by AI or manually
    });

    setTitle('');
    setPriority('Medium');
    setCategory('');
    setEnergyLevel('Medium');
    setShowAIBreakdown(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      setCustomCategories([...customCategories, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleApplySuggestions = (steps: string[]) => {
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      priority,
      category: category || undefined,
      energyLevel,
      microSteps: steps.map(step => ({
        id: crypto.randomUUID(),
        title: step,
        completed: false
      }))
    });

    setTitle('');
    setPriority('Medium');
    setCategory('');
    setEnergyLevel('Medium');
    setShowAIBreakdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to focus on?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 flex items-center gap-1"
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setShowAIBreakdown(!showAIBreakdown);
              setShowAdvanced(false);
            }}
            className="text-sm text-indigo-600 flex items-center gap-1"
          >
            <Sparkles size={16} />
            {showAIBreakdown ? 'Hide AI Breakdown' : 'Get AI Breakdown'}
          </button>
        </div>
        
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {customCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Level Required
              </label>
              <select
                value={energyLevel || 'Medium'}
                onChange={(e) => setEnergyLevel(e.target.value as Task['energyLevel'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Energy</option>
                <option value="Medium">Medium Energy</option>
                <option value="High">High Energy</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Category
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {showAIBreakdown && (
        <AITaskBreakdown
          taskTitle={title}
          userPreferences={userPreferences}
          onApplySuggestions={handleApplySuggestions}
        />
      )}
    </div>
  );
}
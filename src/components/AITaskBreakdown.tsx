import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getAIAssistant } from '../lib/amazonQ';
import type { UserPreferences } from '../types';

interface AITaskBreakdownProps {
  taskTitle: string;
  userPreferences: UserPreferences;
  onApplySuggestions: (steps: string[]) => void;
}

export function AITaskBreakdown({ taskTitle, userPreferences, onApplySuggestions }: AITaskBreakdownProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!taskTitle.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const aiAssistant = getAIAssistant();
      const steps = await aiAssistant.generateTaskBreakdown(taskTitle, userPreferences);
      
      setSuggestions(steps);
    } catch (err) {
      console.error('Error generating suggestions:', err);
      setError('Unable to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions.length > 0) {
      onApplySuggestions(suggestions);
    }
  };

  return (
    <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-indigo-800 flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-600" />
          AI Task Breakdown
        </h3>
        <button
          onClick={generateSuggestions}
          disabled={loading || !taskTitle.trim()}
          className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
            loading || !taskTitle.trim() 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Generating...' : 'Generate Steps'}
        </button>
      </div>
      
      {error && (
        <div className="text-red-600 mb-3 text-sm">{error}</div>
      )}
      
      {suggestions.length > 0 && (
        <>
          <div className="space-y-2 mb-4">
            {suggestions.map((step, index) => (
              <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-md border border-indigo-100">
                <span className="text-indigo-600 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleApply}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
            >
              Apply These Steps
            </button>
          </div>
        </>
      )}
      
      {!loading && suggestions.length === 0 && !error && (
        <p className="text-indigo-700 text-sm">
          Click "Generate Steps" to get AI-powered suggestions for breaking down this task.
        </p>
      )}
    </div>
  );
}
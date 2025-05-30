import React, { useState } from 'react';
import { Code, ExternalLink, Copy, Check } from 'lucide-react';
import type { Task } from '../types';

interface CursorIntegrationProps {
  tasks: Task[];
}

export function CursorIntegration({ tasks }: CursorIntegrationProps) {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Generate a prompt for Cursor AI based on the user's tasks
  const generateCursorPrompt = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    if (incompleteTasks.length === 0) {
      return "I don't have any pending tasks at the moment. Let's discuss how to plan my next steps effectively.";
    }
    
    const taskList = incompleteTasks
      .map(task => {
        const steps = task.microSteps
          .filter(step => !step.completed)
          .map(step => `   - ${step.title}`)
          .join('\n');
          
        return `- ${task.title} (${task.priority} priority)${steps ? '\n' + steps : ''}`;
      })
      .join('\n');
    
    return `I'm working on the following tasks in my FlowBoost app and need help breaking them down further or getting started:

${taskList}

For the highest priority task, can you help me:
1. Break it down into even smaller steps (2-5 minutes each)
2. Suggest a specific starting point that would feel easy to begin
3. Provide a strategy to maintain focus while working on it`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateCursorPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Code size={20} className="text-indigo-600" />
          Cursor AI Integration
        </h3>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </div>
      
      {showInstructions && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg text-sm">
          <h4 className="font-medium mb-2">How to use with Cursor:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Copy the generated prompt below</li>
            <li>Open Cursor AI editor (<a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center">cursor.sh <ExternalLink size={14} /></a>)</li>
            <li>Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Cmd+K</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+K</kbd> to open the AI prompt</li>
            <li>Paste the prompt and press Enter</li>
            <li>Follow Cursor's suggestions to break down your tasks</li>
          </ol>
        </div>
      )}
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Generated Prompt:</h4>
          <button
            onClick={handleCopyPrompt}
            className="text-gray-500 hover:text-indigo-600 p-1"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
        <pre className="text-sm whitespace-pre-wrap text-gray-600 max-h-60 overflow-y-auto">
          {generateCursorPrompt()}
        </pre>
      </div>
      
      <div className="mt-4 text-center">
        <a
          href="https://cursor.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Open Cursor <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
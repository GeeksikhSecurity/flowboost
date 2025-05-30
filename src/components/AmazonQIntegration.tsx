import React, { useState } from 'react';
import { Bot, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Task } from '../types';

interface AmazonQIntegrationProps {
  tasks: Task[];
}

export function AmazonQIntegration({ tasks }: AmazonQIntegrationProps) {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activePrompt, setActivePrompt] = useState<'breakdown' | 'focus' | 'reflection'>('breakdown');

  // Generate different prompts for Amazon Q based on the user's needs
  const generatePrompts = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Task breakdown prompt
    const breakdownPrompt = () => {
      if (incompleteTasks.length === 0) {
        return "I don't have any pending tasks at the moment. Can you help me plan my day effectively?";
      }
      
      // Find the highest priority incomplete task
      const highPriorityTasks = incompleteTasks.filter(task => task.priority === 'High');
      const targetTask = highPriorityTasks.length > 0 ? highPriorityTasks[0] : incompleteTasks[0];
      
      return `I need help breaking down this task into smaller, more manageable steps:

Task: "${targetTask.title}" (${targetTask.priority} priority)

Current micro-steps:
${targetTask.microSteps.map(step => `- ${step.title}${step.completed ? ' (completed)' : ''}`).join('\n')}

Can you help me break this down further into very small steps (2-5 minutes each) that would make it easier to start and maintain focus? I tend to struggle with perfectionism and getting started.`;
    };
    
    // Focus strategies prompt
    const focusPrompt = () => {
      return `I'm working on the following task and struggling to maintain focus:

${incompleteTasks.length > 0 ? `"${incompleteTasks[0].title}"` : 'My current task'}

Can you suggest some specific strategies to:
1. Minimize distractions in my environment
2. Maintain focus during my work session
3. Overcome the urge to switch tasks or check notifications
4. Get back on track when I notice my mind wandering

I'd appreciate practical techniques that I can implement immediately.`;
    };
    
    // Reflection prompt
    const reflectionPrompt = () => {
      const completionRate = tasks.length > 0 ? completedTasks.length / tasks.length : 0;
      const formattedRate = (completionRate * 100).toFixed(0);
      
      return `I've completed ${completedTasks.length} out of ${tasks.length} tasks (${formattedRate}% completion rate).

${completedTasks.length > 0 ? `
Recently completed tasks:
${completedTasks.slice(0, 3).map(task => `- ${task.title}`).join('\n')}
` : ''}

${incompleteTasks.length > 0 ? `
Pending tasks:
${incompleteTasks.slice(0, 3).map(task => `- ${task.title} (${task.priority} priority)`).join('\n')}
` : ''}

Can you help me reflect on my progress and suggest ways to:
1. Celebrate what I've accomplished
2. Identify any patterns in the tasks I complete vs. those I postpone
3. Adjust my approach to make progress on remaining tasks
4. Set realistic expectations for what I can accomplish`;
    };
    
    return {
      breakdown: breakdownPrompt(),
      focus: focusPrompt(),
      reflection: reflectionPrompt()
    };
  };

  const prompts = generatePrompts();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompts[activePrompt]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bot size={20} className="text-indigo-600" />
          Amazon Q Integration
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
          <h4 className="font-medium mb-2">How to use with Amazon Q Developer:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Copy one of the generated prompts below</li>
            <li>Open your IDE with Amazon Q Developer extension</li>
            <li>Open the Amazon Q chat panel</li>
            <li>Paste the prompt and press Enter</li>
            <li>Follow Amazon Q's suggestions to improve your workflow</li>
          </ol>
          <p className="mt-2 text-xs text-gray-600">
            Note: Amazon Q Developer is available in VS Code, JetBrains IDEs, and other supported environments.
          </p>
        </div>
      )}
      
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activePrompt === 'breakdown' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActivePrompt('breakdown')}
        >
          Task Breakdown
        </button>
        <button
          className={`py-2 px-4 ${activePrompt === 'focus' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActivePrompt('focus')}
        >
          Focus Strategies
        </button>
        <button
          className={`py-2 px-4 ${activePrompt === 'reflection' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActivePrompt('reflection')}
        >
          Reflection
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            {activePrompt === 'breakdown' && 'Task Breakdown Prompt:'}
            {activePrompt === 'focus' && 'Focus Strategies Prompt:'}
            {activePrompt === 'reflection' && 'Reflection Prompt:'}
          </h4>
          <button
            onClick={handleCopyPrompt}
            className="text-gray-500 hover:text-indigo-600 p-1"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
        <pre className="text-sm whitespace-pre-wrap text-gray-600 max-h-60 overflow-y-auto">
          {prompts[activePrompt]}
        </pre>
      </div>
      
      <div className="mt-4 text-center">
        <a
          href="https://aws.amazon.com/q/developer/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Learn more about Amazon Q Developer <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
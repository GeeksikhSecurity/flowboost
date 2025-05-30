import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, TrendingUp, Award } from 'lucide-react';
import { getAIAssistant } from '../lib/amazonQ';
import type { Task, UserPreferences } from '../types';
import type { EngagementStrategy, TaskInsight } from '../lib/amazonQ';

interface EngagementInsightsProps {
  tasks: Task[];
  userPreferences: UserPreferences;
}

export function EngagementInsights({ tasks, userPreferences }: EngagementInsightsProps) {
  const [insights, setInsights] = useState<TaskInsight[]>([]);
  const [strategies, setStrategies] = useState<EngagementStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'patterns' | 'strategies'>('patterns');

  useEffect(() => {
    // Only analyze if we have enough tasks to find patterns
    if (tasks.length >= 5) {
      analyzeEngagement();
    }
  }, [tasks]);

  const analyzeEngagement = async () => {
    setLoading(true);
    
    try {
      const aiAssistant = getAIAssistant();
      
      // Get task completion patterns
      const taskInsights = await aiAssistant.analyzeCompletionPatterns(tasks);
      setInsights(taskInsights);
      
      // Calculate user metrics for engagement strategies
      const metrics = calculateUserMetrics(tasks);
      const engagementStrategies = await aiAssistant.suggestEngagementStrategies(metrics);
      setStrategies(engagementStrategies);
    } catch (error) {
      console.error('Error analyzing engagement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserMetrics = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = tasks.length > 0 ? completedTasks.length / tasks.length : 0;
    
    // Calculate average number of steps per task
    const totalSteps = tasks.reduce((sum, task) => sum + task.microSteps.length, 0);
    const avgSteps = tasks.length > 0 ? totalSteps / tasks.length : 0;
    
    // Get categories with at least 2 tasks
    const categoryCounts: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.category) {
        categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      }
    });
    
    const preferredCategories = Object.entries(categoryCounts)
      .filter(([_, count]) => count >= 2)
      .map(([category]) => category);
    
    // Simple time of day preference based on task completion timestamps
    const timePreferences: string[] = [];
    const morningCompletions = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const hour = new Date(task.completedAt).getHours();
      return hour >= 5 && hour < 12;
    }).length;
    
    const afternoonCompletions = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const hour = new Date(task.completedAt).getHours();
      return hour >= 12 && hour < 18;
    }).length;
    
    const eveningCompletions = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const hour = new Date(task.completedAt).getHours();
      return hour >= 18 || hour < 5;
    }).length;
    
    if (morningCompletions > afternoonCompletions && morningCompletions > eveningCompletions) {
      timePreferences.push('morning');
    }
    if (afternoonCompletions > morningCompletions && afternoonCompletions > eveningCompletions) {
      timePreferences.push('afternoon');
    }
    if (eveningCompletions > morningCompletions && eveningCompletions > afternoonCompletions) {
      timePreferences.push('evening');
    }
    
    return {
      completionRate,
      averageSessionDuration: 25, // Default from timer
      taskBreakdownDepth: avgSteps,
      preferredTaskCategories: preferredCategories,
      timeOfDayPreference: timePreferences,
      consecutiveDaysActive: 1 // Placeholder, would need session data
    };
  };

  if (tasks.length < 5) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <TrendingUp className="mx-auto mb-3 text-gray-400" size={24} />
        <p>Complete at least 5 tasks to see engagement insights</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-center ${
            activeTab === 'patterns' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('patterns')}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart size={18} />
            <span>Completion Patterns</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${
            activeTab === 'strategies' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('strategies')}
        >
          <div className="flex items-center justify-center gap-2">
            <Award size={18} />
            <span>Engagement Strategies</span>
          </div>
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Analyzing your task patterns...</p>
          </div>
        ) : (
          <>
            {activeTab === 'patterns' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Your Task Completion Patterns</h3>
                {insights.map((insight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-800">{insight.pattern}</div>
                    <div className="mt-1 text-indigo-600">{insight.suggestion}</div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'strategies' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personalized Engagement Strategies</h3>
                {strategies.map((strategy, index) => (
                  <div key={index} className="border border-indigo-100 rounded-lg overflow-hidden">
                    <div className="bg-indigo-50 p-3">
                      <h4 className="font-medium text-indigo-800">{strategy.title}</h4>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 mb-3">{strategy.description}</p>
                      <div className="space-y-2">
                        {strategy.implementationTips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {tipIndex + 1}
                            </div>
                            <p className="text-gray-600">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
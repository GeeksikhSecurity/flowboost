import React, { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import type { UserPreferences } from '../types';

interface UserPreferencesFormProps {
  initialPreferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function UserPreferencesForm({ initialPreferences, onSave }: UserPreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setPreferences(prev => {
      if (name.includes('.')) {
        // Handle nested properties like 'energyPatterns.morning'
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof UserPreferences],
            [child]: type === 'checkbox' 
              ? (e.target as HTMLInputElement).checked 
              : value
          }
        };
      }
      
      return {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preferences);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <Settings size={20} />
        <span>Preferences</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-10 p-4">
          <h3 className="text-lg font-medium mb-4">Personalize Your Experience</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Style
                </label>
                <select
                  name="learningStyle"
                  value={preferences.learningStyle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Visual">Visual</option>
                  <option value="Auditory">Auditory</option>
                  <option value="Kinesthetic">Kinesthetic</option>
                  <option value="Reading/Writing">Reading/Writing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Breakdown Detail
                </label>
                <select
                  name="breakdownDepth"
                  value={preferences.breakdownDepth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Minimal">Minimal (2-3 steps)</option>
                  <option value="Moderate">Moderate (4-5 steps)</option>
                  <option value="Detailed">Detailed (6+ steps)</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Session (minutes)
                  </label>
                  <input
                    type="number"
                    name="focusSessionDuration"
                    value={preferences.focusSessionDuration}
                    onChange={handleChange}
                    min={5}
                    max={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="breakDuration"
                    value={preferences.breakDuration}
                    onChange={handleChange}
                    min={1}
                    max={30}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Energy Levels
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Morning</label>
                    <select
                      name="energyPatterns.morning"
                      value={preferences.energyPatterns.morning}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Afternoon</label>
                    <select
                      name="energyPatterns.afternoon"
                      value={preferences.energyPatterns.afternoon}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Evening</label>
                    <select
                      name="energyPatterns.evening"
                      value={preferences.energyPatterns.evening}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sound"
                      name="notificationPreferences.sound"
                      checked={preferences.notificationPreferences.sound}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="sound" className="ml-2 text-sm text-gray-700">
                      Sound Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visual"
                      name="notificationPreferences.visual"
                      checked={preferences.notificationPreferences.visual}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="visual" className="ml-2 text-sm text-gray-700">
                      Visual Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reminders"
                      name="notificationPreferences.reminders"
                      checked={preferences.notificationPreferences.reminders}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="reminders" className="ml-2 text-sm text-gray-700">
                      Task Reminders
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save size={16} />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
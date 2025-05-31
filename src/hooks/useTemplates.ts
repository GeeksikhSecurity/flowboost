import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Template {
  id: string;
  name: string;
  template_type: string;
  steps: string[];
}

export function useTemplates(type?: string) {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParams = type ? `?type=${encodeURIComponent(type)}` : '';
        const response = await fetch(`/api/templates${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [session, type]);
  
  const trackTemplateUsage = async (templateId: string, taskId: string, stepsUsed: number) => {
    if (!session?.user) return;
    
    try {
      await fetch('/api/templates/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          taskId,
          stepsUsed,
        }),
      });
    } catch (err) {
      console.error('Error tracking template usage:', err);
    }
  };
  
  return {
    templates,
    isLoading,
    error,
    trackTemplateUsage,
  };
}
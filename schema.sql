-- Database schema for FlowBoost

-- Task templates table
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template usage tracking
CREATE TABLE IF NOT EXISTS template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID NOT NULL REFERENCES task_templates(id),
  task_id UUID NOT NULL,
  steps_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_usage_user_id ON template_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON template_usage(template_id);

-- Insert default templates
INSERT INTO task_templates (name, template_type, steps)
VALUES 
  ('General Task', 'general', '["Break the task into smaller parts", "Identify the first small step", "Set a specific time to start", "Gather necessary resources", "Create a simple checklist"]'),
  ('Writing Task', 'writing', '["Create an outline with main points", "Write a rough draft of the introduction", "Develop each main point in separate sections", "Draft a conclusion", "Review and revise for clarity"]'),
  ('Project Planning', 'project', '["Define the project scope and goals", "Break down into major components", "Identify first small step for each component", "Set up tracking system", "Schedule focused time for first step"]'),
  ('Study Session', 'study', '["Review learning objectives", "Skim material to get an overview", "Read in detail and take notes", "Create practice questions", "Test your understanding"]'),
  ('Email Task', 'email', '["Identify the main purpose of the email", "List key points to include", "Write a clear subject line", "Draft the email body", "Review before sending"]'),
  ('Meeting Prep', 'meeting', '["Define meeting objectives", "Create a simple agenda", "Prepare any necessary materials", "Set a specific timeframe", "Identify action items to discuss"]')
ON CONFLICT (id) DO NOTHING;
export const taskBreakdownTemplates = {
  general: [
    "Break the task into smaller parts",
    "Identify the first small step",
    "Set a specific time to start",
    "Gather necessary resources",
    "Create a simple checklist"
  ],
  writing: [
    "Create an outline with main points",
    "Write a rough draft of the introduction",
    "Develop each main point in separate sections",
    "Draft a conclusion",
    "Review and revise for clarity"
  ],
  project: [
    "Define the project scope and goals",
    "Break down into major components",
    "Identify first small step for each component",
    "Set up tracking system",
    "Schedule focused time for first step"
  ],
  study: [
    "Review learning objectives",
    "Skim material to get an overview",
    "Read in detail and take notes",
    "Create practice questions",
    "Test your understanding"
  ],
  email: [
    "Identify the main purpose of the email",
    "List key points to include",
    "Write a clear subject line",
    "Draft the email body",
    "Review before sending"
  ],
  meeting: [
    "Define meeting objectives",
    "Create a simple agenda",
    "Prepare any necessary materials",
    "Set a specific timeframe",
    "Identify action items to discuss"
  ]
};

export function suggestBreakdown(taskTitle: string, taskType: string): string[] {
  return taskBreakdownTemplates[taskType] || taskBreakdownTemplates.general;
}
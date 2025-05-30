import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTaskSuggestions(taskTitle: string, userPreferences: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI productivity coach specializing in helping users overcome perfectionism and procrastination."
        },
        {
          role: "user",
          content: `Task: "${taskTitle}". User preferences: ${JSON.stringify(userPreferences)}. Provide 3 micro-steps to help break down this task and overcome perfectionism.`
        }
      ],
      temperature: 0.7,
    });

    return {
      suggestions: response.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return {
      suggestions: "Break this task into smaller steps of 15-30 minutes each.",
      success: false
    };
  }
}

export async function analyzeReflection(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI coach that analyzes journal entries to identify patterns related to perfectionism, procrastination, and self-worth. Provide constructive insights and gentle suggestions."
        },
        {
          role: "user",
          content: `Journal entry: "${text}". Analyze this entry for patterns related to perfectionism, procrastination, or self-worth issues. Provide 1-2 gentle insights and a supportive suggestion.`
        }
      ],
      temperature: 0.7,
    });

    return {
      analysis: response.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error analyzing reflection:', error);
    return {
      analysis: "I noticed some patterns in your reflection. Consider breaking down your tasks into smaller steps to make them more manageable.",
      success: false
    };
  }
}
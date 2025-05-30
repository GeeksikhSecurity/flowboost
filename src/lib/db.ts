import { sql } from '@vercel/postgres';

export async function trackEvent(userId: string, eventType: string, eventData = {}) {
  try {
    // First check if we have an active session for this user
    const sessionResult = await sql`
      SELECT id FROM user_sessions 
      WHERE user_id = ${userId} AND ended_at IS NULL 
      ORDER BY started_at DESC LIMIT 1
    `;
    
    let sessionId;
    
    if (sessionResult.rows.length === 0) {
      // Create a new session
      const newSession = await sql`
        INSERT INTO user_sessions (user_id, started_at) 
        VALUES (${userId}, NOW()) 
        RETURNING id
      `;
      sessionId = newSession.rows[0].id;
    } else {
      sessionId = sessionResult.rows[0].id;
    }
    
    // Log the event
    await sql`
      INSERT INTO user_events (user_id, session_id, event_type, event_data) 
      VALUES (${userId}, ${sessionId}, ${eventType}, ${JSON.stringify(eventData)})
    `;
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error };
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const result = await sql`
      SELECT preferences FROM user_preferences 
      WHERE user_id = ${userId}
    `;
    
    return result.rows[0]?.preferences || {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
}

export async function saveUserPreferences(userId: string, preferences: any) {
  try {
    await sql`
      INSERT INTO user_preferences (user_id, preferences)
      VALUES (${userId}, ${JSON.stringify(preferences)})
      ON CONFLICT (user_id) 
      DO UPDATE SET preferences = ${JSON.stringify(preferences)}
    `;
    
    return { success: true };
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return { success: false, error };
  }
}
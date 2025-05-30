/*
  # Engagement Tracking Schema

  1. New Tables
    - `user_sessions`
      - Tracks unique user sessions
      - Records session duration and engagement metrics
    - `user_events`
      - Captures specific user interactions
      - Stores event type, metadata, and timestamps
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  total_focus_time integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  microsteps_completed integer DEFAULT 0
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Events Table
CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  session_id uuid REFERENCES user_sessions(id),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
  ON user_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events"
  ON user_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
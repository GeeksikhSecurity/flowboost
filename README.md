# FlowBoost AI

FlowBoost AI is an advanced, AI-powered personal coach meticulously designed to assist individuals in overcoming persistent challenges such as procrastination, enhancing mental focus, improving self-worth, and ultimately achieving a sustainable state of peak productivity and holistic well-being.

## Features

- **AI-Powered Task Management**: Intelligent task breakdown and prioritization
- **Adaptive Focus System**: Smart Pomodoro timer that adapts to your flow state
- **NLP-Driven Reflection Engine**: Analyze your thoughts and identify patterns
- **AI Cognitive Restructuring Coach**: Overcome perfectionism and self-doubt
- **Goal Setting & Habit Formation**: Track progress and build sustainable habits

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flowboost.git
   cd flowboost
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub.

2. Connect your GitHub repository to Vercel.

3. Configure the environment variables in the Vercel dashboard.

4. Deploy!

## Database Schema

The application uses the following tables:

- `user_sessions`: Tracks user sessions
- `user_events`: Logs user interactions and events
- `user_preferences`: Stores user settings and preferences
- `user_feedback`: Collects user feedback

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [OpenAI](https://openai.com/)
- [Vercel](https://vercel.com/)
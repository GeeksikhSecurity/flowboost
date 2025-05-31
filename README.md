# FlowBoost - Task Management for Focus and Productivity

FlowBoost helps users break down tasks into manageable steps, maintain focus, and build productive habits.

## Features

- **Task Management**: Create, organize, and track tasks
- **Task Templates**: Get suggestions for breaking down common task types
- **Focus Timer**: Work in productive sessions with breaks
- **Progress Tracking**: Visualize your accomplishments

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Vercel account (for deployment)

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

4. Set up the database:
   ```bash
   psql your_database_url -f schema.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Set up environment variables in Vercel:
   ```bash
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add POSTGRES_URL
   ```

2. Deploy to Vercel:
   ```bash
   ./deploy.sh
   ```

## Documentation

- [User Guide](docs/user-guide.md)
- [Technical Documentation](docs/technical-documentation.md)

## Neurodivergent-Friendly Design

FlowBoost is designed with neurodivergent users in mind:

- **Visual Clarity**: Clean interfaces with minimal distractions
- **Cognitive Load Management**: Tasks broken into clear, manageable steps
- **Flexible Interaction**: Multiple ways to accomplish tasks
- **Emotional Support**: Positive reinforcement without overwhelming

## Future Development

In Phase 2, we plan to integrate AI capabilities to enhance the template system:

1. Personalized task suggestions based on user history
2. Natural language processing for task analysis
3. Adaptive coaching based on user patterns

## License

[MIT](LICENSE)
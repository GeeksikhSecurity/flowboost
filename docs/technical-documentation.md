# FlowBoost Technical Documentation

## Architecture Overview

FlowBoost uses Next.js with React components and serverless API routes. The application connects to Vercel Postgres for data storage and uses template-based task suggestions.

## Key Components

### Task Template System
- Predefined templates for common task types
- Usage tracking for future AI training
- Extensible design for adding new templates

### Database Schema
- User authentication and preferences
- Task and micro-step storage
- Template usage analytics

## Implementation Details

### Template-Based Task Breakdown

The core of FlowBoost's current implementation is a template-based task breakdown system:

1. **Template Library**: Predefined sets of steps for common task types (writing, project planning, studying, etc.)
2. **Task Type Selection**: Users select a task type when creating a new task
3. **Step Suggestions**: The system suggests relevant steps based on the selected task type
4. **Usage Tracking**: The system tracks which templates and steps users find most helpful

This approach provides immediate value to users while creating a foundation for future AI enhancements.

### Database Structure

```
task_templates
  - id (UUID)
  - name (VARCHAR)
  - template_type (VARCHAR)
  - steps (JSONB)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

template_usage
  - id (UUID)
  - user_id (UUID)
  - template_id (UUID)
  - task_id (UUID)
  - steps_used (INTEGER)
  - created_at (TIMESTAMP)
```

## Neurodivergent-Friendly Design Principles

### Visual Clarity
- Clean interfaces with minimal distractions
- High contrast between elements
- Consistent layout patterns

### Cognitive Load Management
- Tasks broken into clear, manageable steps
- Progress indicators show completion status
- Focus on one action at a time

### Flexible Interaction
- Multiple ways to accomplish tasks
- Customizable timers for different focus needs
- Option to use or bypass template suggestions

## Future Development (Phase 2)

In Phase 2, we plan to integrate LLM capabilities to enhance the template system:

1. Personalized task suggestions based on user history
2. Natural language processing for task analysis
3. Adaptive coaching based on user patterns
4. Cost-optimized multi-LLM routing system

## Deployment and Maintenance

FlowBoost uses GitHub Actions for CI/CD and deploys to Vercel. Database migrations are managed through Vercel Postgres.

### Deployment Process

1. Set up environment variables in Vercel
2. Run database schema migrations
3. Build and deploy the Next.js application
4. Verify deployment with health checks

### Monitoring

- API endpoint monitoring
- Database performance tracking
- Error logging with Sentry
- Usage analytics

## Production Checklist

- [x] Template-based task breakdown system
- [x] Database schema for templates and usage tracking
- [x] API routes for template retrieval and tracking
- [x] Enhanced AddTask component with template suggestions
- [x] Deployment script
- [ ] Error logging integration
- [ ] Database backup configuration
- [ ] Rate limiting on API routes
- [ ] Performance monitoring
- [ ] CORS and CSP configuration
- [ ] Automated testing setup
- [ ] CI/CD pipeline configuration
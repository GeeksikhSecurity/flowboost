#!/bin/bash
# FlowBoost deployment script

# Exit on error
set -e

echo "🚀 Starting FlowBoost deployment..."

# Set environment variables
echo "⚙️ Setting up environment variables..."
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found. Please create it first."
  exit 1
fi

# Load environment variables
source .env.local

# Check for required variables
if [ -z "$POSTGRES_URL" ]; then
  echo "❌ POSTGRES_URL is not set in .env.local"
  exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ NEXTAUTH_SECRET is not set in .env.local"
  exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL is not set in .env.local"
  exit 1
fi

# Add environment variables to Vercel
echo "⚙️ Adding environment variables to Vercel..."
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add POSTGRES_URL

# Deploy database schema
echo "💾 Deploying database schema..."
echo "Running schema.sql on $POSTGRES_URL"
psql $POSTGRES_URL -f schema.sql

# Build and deploy application
echo "🏗️ Building application..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
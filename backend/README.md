# Analytics & Auto-Response Backend

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose

## Setup
1. Install dependencies:
   - npm install
2. Copy `.env.example` to `.env` and update the MongoDB URI.
3. Start the server:
   - npm run dev
   - npm start

## Main Endpoints

### Analytics
- GET /analytics/average-rating
- GET /analytics/reviews-over-time
- GET /analytics/funnel

### Reviews
- POST /reviews
- GET /reviews

### Settings
- POST /settings/toggle-auto-response
- POST /settings/tone

## Review Payload Example
{
  "userId": "user_123",
  "rating": 5,
  "reviewText": "Great service and fast support"
}

## Tone Payload Example
{
  "tone": "friendly"
}

## Toggle Payload Example
{
  "enabled": true
}

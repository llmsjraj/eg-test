# EG-Test

## Overview
This repository includes two main components: a frontend and a backend. The frontend is built with React, using Material-UI (MUI), Redux, and TypeScript. The backend is developed with NestJS, Mongoose, and Jest (for testing), also utilizing TypeScript.

### Prerequisites
- Node.js
- npm
- MongoDB instance

## Setup Instructions

**Backend Setup:**
1. `cd backend`
2. Install dependencies: `npm install`
3. Start the server (running on port 3000): `npm start`

**Frontend Setup:**
1. `cd frontend` (from the root directory)
2. Install dependencies: `npm install`
3. Start the server (running on port 3001): `npm start`
   - If running the frontend on a different port or facing CORS issues, update the frontend URL in the backend's `.env` file and enable CORS in the backend settings.

## Testing
Run backend tests: 
- `cd backend`
- `npm test`

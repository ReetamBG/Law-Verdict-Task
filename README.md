# N-Device Authentication System

A Next.js application that limits users to N concurrent login sessions (N=3). Uses Auth0 for authentication and PostgreSQL for session storage.

## What This Project Does

Users can only be logged in on 3 devices at once. When they try to log in on a 4th device, they must either:
- Cancel the login
- Force logout one of the existing sessions

When a device is force logged out, it shows a message explaining what happened.

The app has two pages:
- Public landing page
- Private dashboard (shows user's full name and phone number)

## How It Works

### Basic Flow

1. User logs in through Auth0
2. System creates or finds their user record in the database
3. New users must provide their first name, last name, and phone number
4. Each login gets a unique session ID from Auth0
5. Session IDs are stored in the database (max 3 per user)

### When Device Limit is Reached

If a user tries to log in on a 4th device:

1. System detects 3 sessions already exist
2. User sees a list of their active sessions
3. User picks one session to remove, or cancels
4. If they remove a session:
   - Old session ID is deleted from database
   - New session ID is added
   - User continues to dashboard

### How Forced Logout Works

When a device gets force logged out:

1. Its session ID is removed from the database
2. Next time that device makes a request, middleware checks the database
3. Session ID is not found, so the device is logged out
4. User sees a message explaining they were logged out from another device

### Technical Details

- Sessions are stored as an array of strings in PostgreSQL
- Middleware checks every request against the database
- Server actions handle adding/removing sessions
- Max devices configured via `NEXT_PUBLIC_MAX_DEVICES` environment variable

## Technology Stack

- Next.js 15 with React 19
- Auth0 for authentication
- PostgreSQL with Prisma ORM
- TailwindCSS for styling
- Deployed on Vercel

## Environment Variables

The following environment variables are required:

```
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=your-base-url
AUTH0_ISSUER_BASE_URL=your-auth0-issuer-url
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
DATABASE_URL=your-postgresql-database-url
NEXT_PUBLIC_MAX_DEVICES=3
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/ReetamBG/Law-Verdict-Task.git
cd Law-Verdict-Task
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Database Schema

The application uses a single User model:

- `id`: Unique identifier
- `auth0Id`: Auth0 user identifier (unique)
- `firstName`: User's first name
- `lastName`: User's last name
- `phoneNo`: User's phone number
- `sessions`: Array of active session IDs
- `isProfileComplete`: Profile completion status
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

## Services Used

All free tier:
- Auth0 (authentication)
- Vercel (hosting)
- Vercel Postgres (database)

## Project Structure

```
src/
├── actions/          # Server actions for database operations
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions and configurations
└── middleware.ts     # Authentication middleware
```

## Links

- **Live Application**: [Add your deployed URL here]
- **GitHub Repository**: https://github.com/ReetamBG/Law-Verdict-Task

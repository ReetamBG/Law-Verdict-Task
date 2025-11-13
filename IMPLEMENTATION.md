# Law & Verdict - N-Device Session Management

A Next.js application with Auth0 authentication featuring sophisticated N-device session management with a maximum of 3 concurrent sessions.

## 🚀 Features

### Core Functionality
- **Auth0 Authentication**: Secure user authentication and authorization
- **N-Device Limit (N=3)**: Maximum of 3 concurrent active sessions per user
- **Force Logout**: When attempting to log in on a 4th device, users can select which existing session to terminate
- **Graceful Logout**: Force-logged-out devices receive a friendly notification
- **Profile Management**: Users can complete their profile with name and phone number
- **Public & Private Pages**: Home page (public) and Dashboard (private)

### Technical Implementation

#### Session Management Flow

1. **Login Validation**: 
   - When a user logs in, the system checks active sessions
   - If sessions < 3: New session is added automatically
   - If sessions = 3: User sees a dialog to select which device to log out

2. **Force Logout**:
   - User selects one of the 3 active devices
   - Selected device's session is removed from database
   - New session is added for current device
   - Force-logged-out device detects the change on next page load

3. **Graceful Detection**:
   - Root layout checks if current session is still active
   - If session removed: Redirect to `/force-logout` page
   - User sees informative message about being logged out

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with session validation
│   ├── page.tsx                # Public home page
│   ├── dashboard/
│   │   └── page.tsx            # Private dashboard with session conflict handling
│   └── force-logout/
│       └── page.tsx            # Graceful logout notification page
├── actions/
│   └── user.actions.ts         # Server actions for session management
├── components/
│   ├── SessionConflictDialog.tsx    # Dialog for device selection
│   ├── SessionConflictWrapper.tsx   # Client wrapper for dialog
│   ├── CompleteProfileForm.tsx      # Profile completion form
│   ├── Navbar.tsx                   # Navigation component
│   └── ui/                          # Shadcn UI components
├── lib/
│   ├── auth0.ts                # Auth0 configuration
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utility functions
└── middleware.ts               # Auth0 middleware
```

## 🛠️ Key Server Actions

### `validateSession(sessionInfo)`
- Checks if current session is valid
- Returns session conflict info when N+1 login attempted
- Automatically adds new sessions when space available

### `forceLogoutSession(auth0Id, sessionIdToRemove, currentSessionId)`
- Removes selected session from database
- Adds current session in its place
- Validates that user cannot force logout their own current session

### `removeSession(sessionInfo)`
- Removes session on normal logout
- Sets temporary cookie to prevent re-validation during logout

## 🎨 UI Components

### SessionConflictDialog
- Modern, polished dialog using Shadcn UI
- Shows all 3 active sessions with device icons
- Visual feedback for selected device
- Clear action buttons: "Cancel Login" or "Force Logout & Continue"

### Force Logout Page
- Friendly notification screen
- Explains why user was logged out
- Provides quick actions: "Log In Again" or "Go to Home"
- Professional design with icon and color-coded message

## 🔒 Database Schema

```prisma
model User {
  id                String   @id @default(cuid())
  auth0Id           String   @unique
  firstName         String?
  lastName          String?
  phoneNo           String?
  sessions          String[] @default([])  // Array of active session IDs
  isProfileComplete Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## 🔑 Environment Variables

Required environment variables (set in `.env.local`):

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=your-secret-key
APP_BASE_URL=http://localhost:3000
AUTH0_SCOPE=openid profile email
AUTH0_AUDIENCE=optional-api-audience

# Database
DATABASE_URL=postgresql://...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Auth0 account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

### Build
```bash
npm run build
```

### Deploy
The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Next.js

## 🧪 Testing the N-Device Feature

1. **Test Maximum Sessions**:
   - Open the app in 3 different browsers/incognito windows
   - Log in with the same account in all 3
   - All 3 should work fine

2. **Test N+1 Login**:
   - Open a 4th browser/incognito window
   - Log in with the same account
   - Session conflict dialog should appear
   - Select one of the 3 devices to log out
   - Confirm the action

3. **Test Force Logout Detection**:
   - Go back to the logged-out device
   - Refresh the page or navigate
   - Should see the graceful logout page
   - User is informed they were force logged out

## 🎯 User Experience

### Professional UI Features
- **Dark Mode Support**: Automatic theme switching
- **Responsive Design**: Works on all screen sizes (mobile, tablet, desktop)
- **Smooth Animations**: Polished transitions and interactions
- **Clear Feedback**: Loading states, error messages, success confirmations
- **Accessible**: Keyboard navigation, screen reader friendly

### Design System
- **Shadcn UI**: Modern, accessible components
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent iconography
- **Geist Font**: Professional typography

## 📊 Session Tracking

Sessions are tracked using Auth0's internal session ID (`session.internal.sid`), which is:
- Unique per device/browser
- Persistent across page reloads
- Automatically managed by Auth0
- Secure and tamper-proof

## 🔐 Security Considerations

- Sessions stored in database, not cookies
- Server-side validation on every request
- Force logout requires auth0Id validation
- Cannot force logout your own current session
- Automatic cleanup on normal logout
- Protected routes with Auth0 middleware

## 📝 Notes

- **N Value**: Currently configured for N=3 (3 concurrent sessions)
- **No Charges**: Uses free tiers of Auth0, Vercel, and Neon/Supabase PostgreSQL
- **Scalable**: Can easily adjust N value by changing the condition in `validateSession`

## 🐛 Troubleshooting

### Session not being tracked
- Check if Auth0 session is being created properly
- Verify database connection
- Check Prisma Client is generated

### Force logout not working
- Ensure session IDs match in database
- Check server action logs
- Verify Auth0 session includes `internal.sid`

### Graceful logout not showing
- Check layout.tsx session validation logic
- Verify redirect to `/force-logout` is working
- Check if session exists in database

## 📚 Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Auth0
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Shadcn UI + Tailwind CSS
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 👨‍💻 Development

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Server/Client component separation

### Performance
- Server-side rendering
- Optimized bundle size
- Efficient database queries
- Minimal client-side JavaScript

## 📄 License

This project is part of a technical assessment for Law & Verdict.

---

Made with ❤️ using Next.js and Auth0

# Testing Guide for N-Device Session Management

## 🧪 How to Test the Application

### Prerequisites
- Multiple browsers or incognito windows
- One Auth0 account for testing

### Test Scenarios

#### ✅ Test 1: Normal Login (Sessions < 3)

1. Open the app in **Browser 1** (e.g., Chrome)
2. Click "Sign in" and log in with your account
3. Complete your profile (first name, last name, phone number)
4. You should see the dashboard with "Active Sessions (1/3)"

5. Open **Browser 2** (e.g., Firefox) or a new incognito window
6. Go to the same URL and log in with the same account
7. Dashboard should show "Active Sessions (2/3)"

8. Open **Browser 3** (e.g., Safari or another incognito window)
9. Log in with the same account
10. Dashboard should show "Active Sessions (3/3)"

**Expected Result**: ✅ All 3 sessions are active and working

---

#### ✅ Test 2: N+1 Login Attempt (Session Conflict)

1. With 3 sessions already active, open **Browser 4**
2. Go to the app and click "Sign in"
3. Log in with the same account

**Expected Result**: 
- ✅ A dialog appears with the title "Maximum Active Sessions Reached"
- ✅ Shows all 3 active devices with icons
- ✅ Two buttons visible: "Cancel Login" and "Force Logout & Continue"

---

#### ✅ Test 3: Force Logout a Device

1. In the session conflict dialog, select one of the 3 devices (e.g., Device 1)
2. Click "Force Logout & Continue"

**Expected Result**:
- ✅ Dialog closes
- ✅ You are redirected to the dashboard on Browser 4
- ✅ Dashboard shows "Active Sessions (3/3)"
- ✅ The new session replaced the old one

---

#### ✅ Test 4: Graceful Logout Detection

1. Go back to **Browser 1** (the one that was force-logged-out)
2. Refresh the page or click on "Dashboard" link

**Expected Result**:
- ✅ User is redirected to `/force-logout` page
- ✅ Page shows:
  - Orange warning icon
  - "Session Logged Out" title
  - Message: "Your account was logged in from another device..."
  - Two buttons: "Log In Again" and "Go to Home"

---

#### ✅ Test 5: Cancel Login

1. With 3 sessions active, open a new browser (Browser 5)
2. Log in to trigger the session conflict dialog
3. Click "Cancel Login"

**Expected Result**:
- ✅ User is logged out
- ✅ Redirected to the home page
- ✅ Original 3 sessions remain active

---

#### ✅ Test 6: Normal Logout

1. In any of the active sessions, click "Sign out" in the navbar
2. Confirm logout

**Expected Result**:
- ✅ User is logged out
- ✅ Session is removed from the database
- ✅ Other sessions remain active
- ✅ Active sessions count decreases by 1

---

## 🔍 Visual Checks

### Dashboard Page (Profile Complete)
- [ ] Welcome message with user's first name
- [ ] Full name displayed
- [ ] Phone number displayed
- [ ] Email address shown
- [ ] Active Sessions card showing:
  - Device icons (Monitor, Laptop, Smartphone rotating)
  - "This device" badge on current session
  - Session IDs (truncated)
  - Information note about 3-device limit

### Session Conflict Dialog
- [ ] Modal overlay dims background
- [ ] Title: "Maximum Active Sessions Reached"
- [ ] Description explaining the situation
- [ ] 3 device cards displayed
- [ ] Each card shows:
  - Device icon
  - Device number
  - Truncated session ID
- [ ] Selected device has blue border and "Selected" badge
- [ ] Blue info box with explanatory note
- [ ] Two action buttons at bottom

### Force Logout Page
- [ ] Centered card layout
- [ ] Orange circular icon with alert symbol
- [ ] "Session Logged Out" title
- [ ] Explanatory text about being logged out
- [ ] "Log In Again" primary button
- [ ] "Go to Home" secondary button
- [ ] Blue tip box at bottom

---

## 🎨 UI/UX Checks

### Responsive Design
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test on 2XL screens (> 1536px)

### Dark/Light Mode
- [ ] Toggle theme in navbar
- [ ] All components render correctly in both modes
- [ ] Colors have proper contrast

### Accessibility
- [ ] Tab through all interactive elements
- [ ] Dialog can be closed with Escape key
- [ ] Focus states visible
- [ ] Text is readable

---

## 🐛 Edge Cases to Test

### Edge Case 1: Concurrent N+1 Logins
1. Have 3 active sessions
2. Open 2 new browsers simultaneously
3. Try to log in from both at the same time

**Expected**: Both show conflict dialog; first to force logout succeeds

### Edge Case 2: Force Logout Current Session
- Try to force logout your own current session
- **Expected**: Should be prevented (validation in server action)

### Edge Case 3: Profile Incomplete
1. Create new Auth0 account
2. Log in but don't complete profile
3. Try logging in from 3+ devices

**Expected**: Should see profile form, not session conflict

### Edge Case 4: Session Already in DB
1. Log in from Device 1
2. Don't log out, just close browser
3. Reopen browser and go to app

**Expected**: Session still valid, no new session created

---

## 📊 Database Verification

Use Prisma Studio to verify session management:

```bash
npx prisma studio
```

Check the `User` table:
- [ ] `sessions` array has max 3 items when 3 devices active
- [ ] Session IDs are unique strings
- [ ] Sessions are removed on logout
- [ ] Correct session replaced on force logout

---

## 🎯 Performance Checks

- [ ] Dashboard loads quickly
- [ ] Session validation doesn't slow down page loads
- [ ] Dialog opens smoothly
- [ ] Force logout completes within 2 seconds
- [ ] No console errors

---

## ✅ Final Checklist

Before considering testing complete:

- [ ] All 6 main test scenarios pass
- [ ] All visual checks pass
- [ ] Responsive design works on all screen sizes
- [ ] Dark/light mode both work
- [ ] No console errors or warnings
- [ ] Database shows correct session data
- [ ] All edge cases handled gracefully
- [ ] User experience is smooth and professional

---

## 🚀 Quick Test Script

For rapid testing, you can use this sequence:

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Watch database (optional)
npx prisma studio
```

Then open these browsers:
1. Chrome → Login → ✅ Session 1
2. Firefox → Login → ✅ Session 2  
3. Safari → Login → ✅ Session 3
4. Edge → Login → ⚠️ Conflict Dialog → Force Logout Device 1
5. Back to Chrome → Refresh → 🔴 Force Logout Page

Perfect! All tests should pass. 🎉

---

## 📸 Screenshots to Capture

For documentation/demo:
1. Home page (public)
2. Dashboard with completed profile
3. Active sessions card showing 3 devices
4. Session conflict dialog
5. Device selection in dialog
6. Force logout page
7. Mobile responsive views

---

## 🎬 Demo Flow

**Recommended demo sequence:**

1. **Start**: Show home page
2. **Login**: First login, complete profile
3. **Dashboard**: Show active sessions (1 device)
4. **Multi-device**: Login from 2 more browsers
5. **Conflict**: Login from 4th browser, show dialog
6. **Force logout**: Select device, force logout
7. **Graceful**: Go back to logged-out browser, show message
8. **Complete**: Show final state with 3 active sessions

This demonstrates all key features in ~3 minutes!

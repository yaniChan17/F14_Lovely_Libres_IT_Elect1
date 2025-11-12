# Testing Guide

## Manual Testing Checklist

### Authentication Flow

#### Sign Up
1. ✅ Open the app
2. ✅ Click "Sign Up" link on login screen
3. ✅ Test input validation:
   - Enter username with less than 3 characters → Should show error
   - Enter invalid email format → Should show error
   - Enter password less than 6 characters → Should show error
   - Enter non-matching passwords → Should show error
4. ✅ Create valid account:
   - Username: testuser1
   - Email: test1@example.com
   - Password: password123
   - Confirm Password: password123
   - Status: "Hello World!"
5. ✅ Should automatically log in after successful signup
6. ✅ Should see main app with bottom tabs

#### Login
1. ✅ Log out from the profile tab
2. ✅ Click "Login" link
3. ✅ Test invalid credentials → Should show error
4. ✅ Login with valid credentials:
   - Email: test1@example.com
   - Password: password123
5. ✅ Should successfully log in and see main app

### Messenger Tab

#### User List
1. ✅ Navigate to Messenger tab
2. ✅ Should see list of registered users (except current user)
3. ✅ Each user should show:
   - Avatar with first letter of username
   - Username
   - Status/bio (if set)
4. ✅ Pull to refresh to reload user list

#### Chat
1. ✅ Click on a user from the list
2. ✅ Should open chat screen with user's name in header
3. ✅ Type a message and send
4. ✅ Message should appear on the right (sent)
5. ✅ Create second account (testuser2) and send messages
6. ✅ Switch back to first account
7. ✅ Should see received messages on the left
8. ✅ Messages should show:
   - Message text
   - Timestamp
   - Different color for sent/received
9. ✅ Test empty message → Send button should be disabled
10. ✅ Test long messages → Should wrap properly
11. ✅ Test message persistence → Close and reopen chat, messages should remain

### Profile Tab

#### Profile Display
1. ✅ Navigate to Profile tab
2. ✅ Should see:
   - Large avatar with first letter of username
   - Username
   - Status/bio
   - Logout button (door emoji)
3. ✅ Click on status text to edit it
4. ✅ Update status and save
5. ✅ Status should update on profile

#### Create Post
1. ✅ Click "What's on your mind?" button
2. ✅ Modal should open
3. ✅ Enter post content
4. ✅ Click "Post" button
5. ✅ Post should appear in feed
6. ✅ Post should show:
   - Avatar
   - Username
   - Timestamp
   - Post content
   - Like button with count
   - Comment button with count

#### Reactions (Likes)
1. ✅ Click heart icon on a post
2. ✅ Heart should turn red/filled
3. ✅ Like count should increase
4. ✅ Click again to unlike
5. ✅ Heart should turn white/empty
6. ✅ Like count should decrease
7. ✅ Test with multiple accounts
8. ✅ Each account should have independent like state

#### Comments
1. ✅ Click comment icon on a post
2. ✅ Comments modal should open
3. ✅ Should show existing comments or "No comments yet"
4. ✅ Type a comment and click "Send"
5. ✅ Comment should appear in list
6. ✅ Comment should show:
   - Avatar
   - Username
   - Comment text
   - Timestamp
7. ✅ Comment count should update on post
8. ✅ Add multiple comments
9. ✅ Close and reopen comments → All comments should persist

### Data Persistence

1. ✅ Create multiple accounts
2. ✅ Send messages between accounts
3. ✅ Create posts with multiple accounts
4. ✅ Add likes and comments
5. ✅ Close the app completely
6. ✅ Reopen the app
7. ✅ All data should persist:
   - Users remain registered
   - Messages are still there
   - Posts are still visible
   - Likes and comments are preserved

### Edge Cases

1. ✅ Test with no internet connection → Should work offline
2. ✅ Test with multiple rapid interactions
3. ✅ Test with very long text inputs
4. ✅ Test with special characters in inputs
5. ✅ Test switching between tabs frequently
6. ✅ Test with many users (10+)
7. ✅ Test with many messages (100+)
8. ✅ Test with many posts (20+)

### Error Handling

1. ✅ Test duplicate username during signup
2. ✅ Test duplicate email during signup
3. ✅ Test invalid login credentials
4. ✅ Test empty required fields
5. ✅ Test invalid email format
6. ✅ Test password mismatch
7. ✅ Test empty post content
8. ✅ Test empty comment

## Platform Testing

### Android
- Test on Android emulator (API 29+)
- Test on physical Android device
- Test all features listed above
- Verify APK build works

### iOS
- Test on iOS simulator (iOS 13+)
- Test on physical iOS device
- Test all features listed above
- Verify app build works

## Performance Testing

1. ✅ App startup time < 3 seconds
2. ✅ Screen transitions are smooth
3. ✅ Scrolling is smooth
4. ✅ No memory leaks
5. ✅ Database queries are fast
6. ✅ UI remains responsive during operations

## Security Testing

1. ✅ Passwords are hashed (SHA-256)
2. ✅ Passwords are not visible in plain text
3. ✅ Database stores hashed passwords only
4. ✅ No sensitive data in console logs
5. ✅ Proper input validation on all fields

## Expected Behavior

### Successfully Working Features
- ✅ User registration with validation
- ✅ User login with authentication
- ✅ Password hashing and verification
- ✅ User list display
- ✅ One-on-one messaging
- ✅ Message persistence
- ✅ Post creation
- ✅ Post display in feed
- ✅ Reactions/likes toggle
- ✅ Comments functionality
- ✅ Status/bio updates
- ✅ Profile display
- ✅ Navigation between tabs
- ✅ Logout functionality
- ✅ SQLite data persistence
- ✅ Offline functionality

### Known Limitations
- ❌ Web platform not supported (SQLite is native only)
- ℹ️ Real-time updates require manual refresh (no WebSocket)
- ℹ️ Chat messages poll every 2 seconds when chat is open
- ℹ️ No push notifications
- ℹ️ No file/image uploads (basic text only)
- ℹ️ No message read receipts
- ℹ️ No typing indicators

## Automated Testing

Currently, the project does not include automated tests. For production use, consider adding:
- Unit tests for utility functions
- Integration tests for database operations
- E2E tests for user flows
- Snapshot tests for UI components

Test frameworks to consider:
- Jest for unit tests
- React Native Testing Library
- Detox for E2E tests

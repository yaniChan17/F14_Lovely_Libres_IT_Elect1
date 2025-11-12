# Architecture Documentation

## System Overview

The React Native Messenger app is a mobile application built using Expo and React Native. It provides a comprehensive messaging and social media platform with local data persistence using SQLite.

## Architecture Pattern

The application follows a **Component-Based Architecture** with **Context API** for state management and **SQLite** for local data storage.

### Key Architectural Decisions

1. **Local-First Architecture**: All data is stored locally in SQLite, making the app fully functional offline.
2. **Context API for State**: Simple and effective for authentication state management.
3. **Screen-Based Navigation**: React Navigation with stack and tab navigators.
4. **Modular Database Layer**: All database operations are centralized in `database/database.js`.

## Folder Structure

```
├── App.js                      # Root component with AuthProvider
├── index.js                    # App entry point
│
├── context/
│   └── AuthContext.js          # Authentication context and user state
│
├── navigation/
│   └── RootNavigator.js        # Navigation configuration
│       ├── AuthStack           # Login/Signup screens
│       ├── MainTabs            # Bottom tabs (Messenger, Profile)
│       └── MessengerStack      # Messenger flow (UserList, Chat)
│
├── screens/
│   ├── LoginScreen.js          # User login
│   ├── SignupScreen.js         # User registration
│   ├── UserListScreen.js       # List of users for messaging
│   ├── ChatScreen.js           # One-on-one chat interface
│   └── ProfileScreen.js        # User profile and posts feed
│
├── components/
│   └── Avatar.js               # Reusable avatar component
│
├── database/
│   └── database.js             # SQLite setup and all DB queries
│
└── utils/
    ├── validation.js           # Input validation functions
    └── crypto.js               # Password hashing utilities
```

## Data Flow

### Authentication Flow
```
User Input → Validation → Database Query → Hash Check → Context Update → Navigation
```

1. User enters credentials
2. Validation checks input format
3. Database queries for user record
4. Password hash is verified
5. User state is updated in AuthContext
6. Navigation switches to MainTabs

### Messaging Flow
```
Chat Screen → Send Message → Database Insert → Reload Messages → Update UI
```

1. User types message
2. Message is validated
3. Database inserts message with sender/receiver IDs
4. Messages are reloaded from database
5. UI updates with new message
6. Polling continues every 2 seconds for new messages

### Social Feed Flow
```
Create Post → Database Insert → Reload Posts → Update UI
Toggle Like → Database Update → Reload Posts → Update UI
Add Comment → Database Insert → Reload Comments → Update UI
```

## Database Schema

### Tables and Relationships

```
users (1) ----< (N) messages
users (1) ----< (N) posts
posts (1) ----< (N) reactions
posts (1) ----< (N) comments
users (1) ----< (N) reactions
users (1) ----< (N) comments
```

### SQL Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  profile_picture TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users (id),
  FOREIGN KEY (receiver_id) REFERENCES users (id)
);

-- Posts table
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Reactions table
CREATE TABLE reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  type TEXT DEFAULT 'like',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## State Management

### AuthContext

The AuthContext provides:
- `user`: Current logged-in user object
- `isLoading`: Database initialization status
- `dbInitialized`: Whether database is ready
- `login(userId)`: Login function
- `logout()`: Logout function
- `updateUser(userId)`: Refresh user data

### Component State

Each screen manages its local state for:
- Form inputs
- Loading states
- Error messages
- Modal visibility

## Navigation Structure

```
<NavigationContainer>
  {user ? (
    <MainTabs>
      <Tab name="Messenger">
        <MessengerStack>
          <Screen name="UserList" />
          <Screen name="Chat" />
        </MessengerStack>
      </Tab>
      <Tab name="Profile">
        <Screen name="Profile" />
      </Tab>
    </MainTabs>
  ) : (
    <AuthStack>
      <Screen name="Login" />
      <Screen name="Signup" />
    </AuthStack>
  )}
</NavigationContainer>
```

## Security Considerations

### Password Security
- Passwords are hashed using SHA-256 via `expo-crypto`
- Plain text passwords are never stored
- Hash verification on login

### Input Validation
- Email format validation
- Username requirements (3-20 chars, alphanumeric)
- Password minimum length (6 chars)
- SQL injection prevented by parameterized queries

### Data Isolation
- Users can only see their own profile
- Messages are filtered by sender/receiver
- Each user's data is properly scoped

## Performance Optimizations

### Database
- Indexes on foreign keys (automatic with SQLite)
- Efficient queries with JOINs
- Batch operations where possible

### UI/UX
- FlatList for efficient list rendering
- Pull-to-refresh for manual updates
- Optimistic UI updates
- Minimal re-renders with proper React patterns

### Memory
- Proper cleanup in useEffect hooks
- Interval clearing on unmount
- Modal state management

## Scalability Considerations

### Current Limitations
- No pagination (loads all data)
- Polling for new messages (2-second interval)
- No background sync
- Local storage only (no cloud sync)

### Future Enhancements
1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Real-time Updates**: Add WebSocket support for instant updates
3. **Cloud Sync**: Implement backend API for cloud storage
4. **Push Notifications**: Add Firebase Cloud Messaging
5. **Media Support**: Add image/video uploads
6. **Search**: Implement full-text search
7. **Performance**: Add Redis-like caching layer
8. **Analytics**: Add usage tracking

## Testing Strategy

### Manual Testing
- See TESTING.md for comprehensive manual test cases
- Test on Android and iOS platforms
- Test edge cases and error scenarios

### Recommended Automated Testing
1. **Unit Tests**: Test utility functions (validation, crypto)
2. **Integration Tests**: Test database operations
3. **Component Tests**: Test React components in isolation
4. **E2E Tests**: Test complete user flows

## Deployment

### Development
```bash
npm start
```

### Production Build

#### Android APK
```bash
eas build --platform android
```

#### iOS IPA
```bash
eas build --platform ios
```

### Configuration

Update `app.json` for:
- App name and slug
- Version numbers
- Icons and splash screens
- Permissions
- Build settings

## Monitoring and Debugging

### Development Tools
- React DevTools for component inspection
- Expo DevTools for logs and debugging
- Chrome DevTools for network inspection

### Logging
- Console logs for development
- Error boundaries for crash handling
- Database operation logging

## Dependencies

### Core
- `expo`: Development platform
- `react`: UI library
- `react-native`: Mobile framework

### Navigation
- `@react-navigation/native`: Navigation core
- `@react-navigation/bottom-tabs`: Tab navigation
- `@react-navigation/native-stack`: Stack navigation
- `react-native-screens`: Native screen management
- `react-native-safe-area-context`: Safe area handling

### Storage
- `expo-sqlite`: Local SQLite database

### Security
- `expo-crypto`: Password hashing

### UI
- `expo-status-bar`: Status bar styling

## Maintenance

### Regular Tasks
1. Update dependencies monthly
2. Test on latest OS versions
3. Monitor crash reports
4. Review performance metrics
5. Backup test data

### Code Quality
- Follow React best practices
- Maintain consistent code style
- Document complex logic
- Keep components small and focused
- Write meaningful commit messages

## License

0BSD - Free to use and modify

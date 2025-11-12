# React Native Messenger App

A full-featured messaging and social media application built with React Native and Expo.

## Features

### 🔐 Authentication System
- User registration with validation
- Secure login with SHA-256 password hashing
- Email and username validation
- Profile status/bio management

### 💬 Messaging
- Real-time chat interface
- One-on-one conversations
- Message history stored in SQLite
- User list with online status

### 📱 Social Features
- Create and share posts
- Like/react to posts
- Comment on posts
- Personal profile feed
- User profile with avatar and status

### 🗄️ Database
- SQLite local database
- Tables: users, messages, posts, reactions, comments
- Secure password storage
- Efficient data queries

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **expo-sqlite** - Local database (Native only - Android/iOS)
- **expo-crypto** - Password hashing
- **Context API** - State management

**Note:** This app uses SQLite for local storage, which is only available on native platforms (Android/iOS). Web platform is not fully supported.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical device)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd F14_Lovely_Libres_IT_Elect1
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your device
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

**Important:** This app requires native SQLite support and will not work in web browsers. Please test on Android or iOS devices/simulators.

## Project Structure

```
├── App.js                 # Main app component
├── context/
│   └── AuthContext.js     # Authentication context
├── database/
│   └── database.js        # SQLite database setup and queries
├── navigation/
│   └── RootNavigator.js   # Navigation configuration
├── screens/
│   ├── LoginScreen.js     # Login page
│   ├── SignupScreen.js    # Registration page
│   ├── UserListScreen.js  # User list for messaging
│   ├── ChatScreen.js      # Chat interface
│   └── ProfileScreen.js   # Profile and posts feed
└── utils/
    ├── validation.js      # Input validation helpers
    └── crypto.js          # Password hashing utilities
```

## Database Schema

### Users Table
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- profile_picture
- status
- created_at

### Messages Table
- id (PRIMARY KEY)
- sender_id (FOREIGN KEY)
- receiver_id (FOREIGN KEY)
- message
- timestamp

### Posts Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- content
- created_at

### Reactions Table
- id (PRIMARY KEY)
- post_id (FOREIGN KEY)
- user_id (FOREIGN KEY)
- type
- created_at

### Comments Table
- id (PRIMARY KEY)
- post_id (FOREIGN KEY)
- user_id (FOREIGN KEY)
- content
- created_at

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your account with email and password
3. **Messenger Tab**:
   - View list of all users
   - Click on a user to start chatting
   - Send and receive messages
4. **Profile Tab**:
   - View your profile information
   - Create new posts
   - Like and comment on posts
   - Update your status/bio

## Building for Production

### Android APK
```bash
npm run android
expo build:android
```

### iOS
```bash
npm run ios
expo build:ios
```

## Features Implemented

✅ User registration and authentication
✅ Password hashing (SHA-256)
✅ Input validation
✅ User list display
✅ One-on-one messaging
✅ Profile management
✅ Post creation
✅ Reactions/likes system
✅ Comments functionality
✅ Bottom tab navigation
✅ SQLite data persistence
✅ Offline functionality

## License

0BSD

## Author

Lovely Jana Niña Libres
BSIT3 Block 3

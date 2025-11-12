# Quick Start Guide

Get your React Native Messenger app up and running in minutes!

## Prerequisites

Make sure you have these installed:
- ✅ Node.js (v14 or higher)
- ✅ npm or yarn
- ✅ Expo CLI (`npm install -g expo-cli`)
- ✅ Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd F14_Lovely_Libres_IT_Elect1

# Install dependencies
npm install
```

### 2. Start the Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Show a QR code in the terminal
- Open Expo DevTools in your browser

### 3. Run on Your Device

**Option A: Physical Device (Recommended)**
1. Install Expo Go app on your phone
2. Scan the QR code with:
   - **iPhone**: Use Camera app
   - **Android**: Use Expo Go app
3. Wait for the app to load

**Option B: Emulator**
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator

## First Time Usage

### Create Your First Account

1. When the app loads, you'll see the Login screen
2. Click **"Sign Up"** at the bottom
3. Fill in the form:
   ```
   Username: john_doe
   Email: john@example.com
   Password: password123
   Confirm Password: password123
   Status: "Hey there! I'm using Messenger"
   ```
4. Click **"Sign Up"**
5. You'll be automatically logged in!

### Explore the App

**Messenger Tab** 💬
- Initially empty (no other users yet)
- Create another account to test messaging
- Click on a user to start chatting

**Profile Tab** 👤
- View your profile information
- Create your first post
- Like and comment on posts

## Creating Multiple Test Accounts

To test the messaging feature, you need at least 2 accounts:

```bash
# Account 1
Username: alice
Email: alice@example.com
Password: test123

# Account 2
Username: bob
Email: bob@example.com
Password: test123
```

**Steps:**
1. Create first account and logout
2. Create second account
3. Go to Messenger tab
4. You'll see the first account
5. Start chatting!

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Build for Android
npm run android

# Build for iOS (Mac only)
npm run ios

# View logs
npm start -- --dev
```

## Troubleshooting

### "Database not initialized" Error
- Wait a few seconds for database initialization
- Restart the app if needed

### "Metro bundler error"
```bash
# Clear cache and restart
npm start -- --clear
```

### QR Code Not Scanning
1. Make sure your phone and computer are on the same WiFi network
2. Try using tunnel mode: `npm start -- --tunnel`

### App Not Loading
1. Check that Expo CLI is installed: `expo --version`
2. Update Expo CLI: `npm install -g expo-cli`
3. Clear cache: `npm start -- --clear`

### Database Issues
- Close and restart the app
- Uninstall and reinstall the app
- Database will be recreated automatically

## Testing Features

### Test Authentication
✅ Sign up with valid data
✅ Sign up with invalid data (check validation)
✅ Login with correct credentials
✅ Login with wrong credentials

### Test Messaging
✅ Send messages between users
✅ View message history
✅ Test with long messages
✅ Test empty message (should be disabled)

### Test Social Features
✅ Create posts
✅ Like/unlike posts
✅ Add comments
✅ Update status/bio

## Development Tips

### Hot Reloading
- Press `r` in terminal to reload
- Shake device to open developer menu
- Enable "Fast Refresh" for automatic reload

### Debugging
- Shake device → "Debug JS Remotely"
- View console logs in Chrome DevTools
- Use React DevTools for component inspection

### Database Inspection
On Android:
```bash
adb shell
cd /data/data/host.exp.exponent/databases
sqlite3 messenger.db
.tables
SELECT * FROM users;
```

## Project Structure

```
├── App.js              # Root component
├── screens/            # All screen components
├── components/         # Reusable components
├── database/           # SQLite setup and queries
├── navigation/         # Navigation config
├── context/            # React Context (Auth)
└── utils/              # Helper functions
```

## Next Steps

1. ✅ Create multiple test accounts
2. ✅ Send messages between accounts
3. ✅ Create posts and interact with them
4. ✅ Explore all features
5. ✅ Customize the app to your needs

## Support

For issues or questions:
1. Check [README.md](README.md) for detailed documentation
2. Review [TESTING.md](TESTING.md) for test cases
3. See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

## Ready to Build for Production?

See [README.md](README.md) for instructions on:
- Building Android APK
- Building iOS IPA
- Configuring app icons and splash screens
- Publishing to app stores

---

**Happy coding! 🚀**

# App Flow Diagram

## User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                      APP STARTS                             │
│                    (AuthContext)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──► Database Initialized? ──► No ──► Loading...
                     │                          │
                     │                          └──► Initialize SQLite
                     │
                     ▼
            ┌────────────────┐
            │  User Logged   │
            │      In?       │
            └────┬──────┬────┘
                 │      │
            No   │      │   Yes
                 │      │
    ┌────────────▼──┐   └──────────▼─────────────┐
    │  AUTH STACK   │              │  MAIN TABS   │
    └───────────────┘              └──────────────┘
            │                              │
    ┌───────┴────────┐          ┌─────────┴─────────┐
    │                │          │                   │
┌───▼────┐    ┌─────▼──┐   ┌──▼────────┐   ┌──────▼────┐
│ LOGIN  │◄──►│ SIGNUP │   │ MESSENGER │   │  PROFILE  │
│ SCREEN │    │ SCREEN │   │    TAB    │   │    TAB    │
└────────┘    └────────┘   └───────────┘   └───────────┘
                                   │               │
                          ┌────────┴─────┐         │
                          │              │         │
                     ┌────▼────┐   ┌─────▼───┐    │
                     │  USER   │   │  CHAT   │    │
                     │  LIST   │──►│ SCREEN  │    │
                     └─────────┘   └─────────┘    │
                                                   │
                                          ┌────────▼────────┐
                                          │  Profile Feed   │
                                          │  ├── Posts      │
                                          │  ├── Reactions  │
                                          │  └── Comments   │
                                          └─────────────────┘
```

## Screen Flow Details

### 🔐 Authentication Flow

```
┌──────────┐     Valid Input     ┌─────────────┐
│  Login   │────────────────────►│  Validate   │
│  Screen  │                     │  Credentials │
└──────────┘                     └──────┬──────┘
     │                                  │
     │ Navigate to                      │ Success
     │ Signup                           │
     ▼                                  ▼
┌──────────┐     Create Account   ┌──────────┐
│  Signup  │────────────────────►│   Main   │
│  Screen  │                     │   Tabs   │
└──────────┘                     └──────────┘
     │
     │ Already have account
     │
     └──────────────────────────► Back to Login
```

### 💬 Messaging Flow

```
┌───────────┐   Select User    ┌──────────┐   Send Message   ┌──────────┐
│   User    │─────────────────►│   Chat   │─────────────────►│ SQLite   │
│   List    │                  │  Screen  │                  │ Database │
└───────────┘                  └──────────┘                  └──────────┘
     ▲                              │                              │
     │                              │                              │
     │ Pull to Refresh              │ Poll every 2s               │
     │                              ▼                              │
     └──────────────────────── Load Messages ◄───────────────────┘
```

### 📱 Profile & Social Flow

```
┌───────────┐
│  Profile  │
│   Tab     │
└─────┬─────┘
      │
      ├──► View Profile Info
      │    ├── Avatar
      │    ├── Username
      │    └── Status/Bio ──► Edit Status Modal
      │
      ├──► Create Post Button ──► Post Creation Modal
      │                           │
      │                           └──► Save to SQLite
      │
      └──► View Posts Feed
           │
           ├──► Post 1
           │    ├── Like Button ──► Toggle Reaction
           │    │                   └──► Update Count
           │    │
           │    └──► Comment Button ──► Comments Modal
           │                           │
           │                           ├── View Comments
           │                           └── Add Comment
           │
           ├──► Post 2
           │    └── ...
           │
           └──► Post N
```

## Data Flow Architecture

```
┌─────────────┐
│   Screen    │  User Interaction
│ Component   │─────────┐
└─────────────┘         │
                        ▼
                ┌───────────────┐
                │  Validation   │  Check Input
                │   (utils/)    │──────┐
                └───────────────┘      │
                        │              │
                        │ Valid        │ Invalid
                        ▼              ▼
                ┌───────────────┐  ┌──────────┐
                │   Database    │  │  Error   │
                │  Operations   │  │ Message  │
                │ (database/)   │  └──────────┘
                └───────┬───────┘
                        │
                        ├──► Execute SQL Query
                        │
                        ▼
                ┌───────────────┐
                │    SQLite     │  Store/Retrieve
                │   Database    │  Data
                └───────┬───────┘
                        │
                        │ Success/Data
                        ▼
                ┌───────────────┐
                │  Update UI    │  Re-render
                │  (setState)   │  Component
                └───────────────┘
```

## Authentication State Management

```
┌──────────────────────────────────────┐
│          AuthContext                 │
│  ┌────────────────────────────────┐  │
│  │ State:                         │  │
│  │  - user (object or null)       │  │
│  │  - isLoading (boolean)         │  │
│  │  - dbInitialized (boolean)     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Methods:                       │  │
│  │  - login(userId)               │  │
│  │  - logout()                    │  │
│  │  - updateUser(userId)          │  │
│  └────────────────────────────────┘  │
└───────────────┬──────────────────────┘
                │
                ├──► Wraps entire app
                │
                ▼
        ┌───────────────┐
        │  All Screens  │  Access via useAuth()
        │  & Components │  
        └───────────────┘
```

## Database Relationship Diagram

```
┌─────────────┐
│    users    │
│ ─────────── │
│ id (PK)     │◄─────┐
│ username    │      │
│ email       │      │
│ password    │      │
│ status      │      │
└──────┬──────┘      │
       │             │
       │ 1           │ N
       │             │
       ├─────────────┼─────────────┐
       │             │             │
     N │           N │           N │
       │             │             │
┌──────▼──────┐ ┌────▼──────┐ ┌───▼──────┐
│  messages   │ │   posts   │ │reactions │
│ ─────────── │ │ ───────── │ │──────────│
│ id (PK)     │ │ id (PK)   │ │ id (PK)  │
│ sender_id   │ │ user_id   │ │ post_id  │
│ receiver_id │ │ content   │ │ user_id  │
│ message     │ └─────┬─────┘ └──────────┘
│ timestamp   │       │
└─────────────┘       │ 1
                      │
                    N │
                      │
               ┌──────▼──────┐
               │  comments   │
               │ ─────────── │
               │ id (PK)     │
               │ post_id     │
               │ user_id     │
               │ content     │
               └─────────────┘
```

## Navigation Structure

```
<NavigationContainer>
  │
  ├─► user === null ? (Not Logged In)
  │   │
  │   └─► <AuthStack>
  │        ├─► LoginScreen
  │        └─► SignupScreen
  │
  └─► user !== null ? (Logged In)
      │
      └─► <MainTabs> (Bottom Tab Navigator)
           │
           ├─► Tab: "Messenger" 💬
           │    └─► <MessengerStack>
           │         ├─► UserListScreen
           │         └─► ChatScreen (nested)
           │
           └─► Tab: "Profile" 👤
                └─► ProfileScreen
```

## Feature Module Map

```
┌─────────────────────────────────────────┐
│              APP ROOT                   │
│         (App.js + index.js)            │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────┐       ┌────────▼────────┐
│  Context   │       │   Navigation    │
│  Provider  │       │   Configuration │
└────────────┘       └─────────────────┘
    │                         │
    │                         │
┌───▼────────────────────────▼────┐
│           Screens               │
│  ┌─────────────────────────┐   │
│  │ LoginScreen             │   │
│  │ SignupScreen            │   │
│  │ UserListScreen          │   │
│  │ ChatScreen              │   │
│  │ ProfileScreen           │   │
│  └─────────────────────────┘   │
└───────────────┬─────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼────┐ ┌────▼────┐ ┌───▼────┐
│Database│ │ Utils   │ │Compo-  │
│        │ │         │ │nents   │
│SQLite  │ │Validate │ │Avatar  │
│Queries │ │Crypto   │ │etc.    │
└────────┘ └─────────┘ └────────┘
```

## Real-time Update Flow (Polling)

```
Chat Screen Open
      │
      ├──► Initial Load Messages
      │    │
      │    └──► Display in UI
      │
      ├──► Start Interval (2 seconds)
      │    │
      │    └──► Every 2 seconds:
      │         ├──► Fetch messages from DB
      │         ├──► Compare with current state
      │         └──► Update if changed
      │
      └──► On Unmount
           └──► Clear Interval
```

## Security Flow

```
User Password
      │
      ├──► Input: "password123"
      │
      ▼
┌─────────────┐
│  SHA-256    │
│  Hashing    │  (expo-crypto)
└──────┬──────┘
       │
       ├──► Output: "5e884898da28047151d0e56f8dc629..."
       │
       ▼
┌─────────────┐
│   Store in  │
│   SQLite    │  (password_hash column)
└─────────────┘

Login Verification:
┌─────────────┐
│ Input Pass  │
└──────┬──────┘
       │
       ├──► Hash with SHA-256
       │
       ▼
┌─────────────┐
│  Compare    │
│  with Stored│
│    Hash     │
└──────┬──────┘
       │
       ├──► Match? ──► Login Success
       │
       └──► No Match? ──► Login Failed
```

## Error Handling Flow

```
User Action
    │
    ▼
┌─────────────┐
│  Validate   │──► Invalid ──► Show Error Message
│   Input     │                (Alert/Text)
└──────┬──────┘
       │
       │ Valid
       ▼
┌─────────────┐
│  Database   │──► Error ──► Try-Catch Block
│  Operation  │              ├──► Log Error
└──────┬──────┘              └──► Show Alert
       │
       │ Success
       ▼
┌─────────────┐
│  Update UI  │
└─────────────┘
```

---

## Summary

This app follows a clean, modular architecture with:
- **Clear separation of concerns** (screens, database, utils, context)
- **Unidirectional data flow** (user action → validation → database → UI update)
- **Centralized state management** (AuthContext for user state)
- **Secure authentication** (SHA-256 password hashing)
- **Offline-first** (SQLite local database)
- **Clean navigation** (React Navigation with tabs and stacks)

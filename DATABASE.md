# Database Query Reference

This document provides a reference for all database operations in the app.

## Database Initialization

```javascript
// Initialize database and create tables
await openDatabase();
```

This creates the following tables:
- `users` - User accounts
- `messages` - Chat messages
- `posts` - User posts
- `reactions` - Post likes
- `comments` - Post comments

## User Operations

### Create User (Signup)
```javascript
const userId = await createUser(
  username,      // string: unique username
  email,         // string: unique email
  passwordHash,  // string: SHA-256 hash
  profilePicture, // string: (optional) URL or path
  status         // string: user bio/status
);
```

**Example:**
```javascript
const hash = await hashPassword('mypassword');
const id = await createUser('john_doe', 'john@example.com', hash, null, 'Hello!');
// Returns: user ID (integer)
```

### Get User by Email (Login)
```javascript
const user = await getUserByEmail(email);
```

**Returns:**
```javascript
{
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  password_hash: '5e884...', // SHA-256 hash
  profile_picture: null,
  status: 'Hello!',
  created_at: '2024-01-15 10:30:00'
}
```

### Get User by Username
```javascript
const user = await getUserByUsername(username);
```

**Returns:** Same as `getUserByEmail`

### Get User by ID
```javascript
const user = await getUserById(userId);
```

### Get All Users
```javascript
const users = await getAllUsers();
```

**Returns:** Array of user objects (without password_hash)

### Update User Status
```javascript
await updateUserStatus(userId, newStatus);
```

## Message Operations

### Create Message
```javascript
const messageId = await createMessage(
  senderId,    // integer: sender user ID
  receiverId,  // integer: receiver user ID
  message      // string: message content
);
```

**Example:**
```javascript
await createMessage(1, 2, 'Hello Bob!');
// Returns: message ID
```

### Get Messages Between Two Users
```javascript
const messages = await getMessagesBetweenUsers(userId1, userId2);
```

**Returns:**
```javascript
[
  {
    id: 1,
    sender_id: 1,
    receiver_id: 2,
    message: 'Hello Bob!',
    timestamp: '2024-01-15 10:30:00',
    sender_username: 'john_doe'
  },
  // ... more messages
]
```

**SQL Query:**
```sql
SELECT m.*, u.username as sender_username 
FROM messages m 
JOIN users u ON m.sender_id = u.id
WHERE (m.sender_id = ? AND m.receiver_id = ?) 
   OR (m.sender_id = ? AND m.receiver_id = ?)
ORDER BY m.timestamp ASC
```

### Get Recent Chats
```javascript
const chats = await getRecentChats(userId);
```

**Returns:** List of users with recent conversations

## Post Operations

### Create Post
```javascript
const postId = await createPost(
  userId,   // integer: user ID
  content   // string: post content
);
```

**Example:**
```javascript
await createPost(1, 'This is my first post!');
// Returns: post ID
```

### Get All Posts
```javascript
const posts = await getAllPosts();
```

**Returns:**
```javascript
[
  {
    id: 1,
    user_id: 1,
    content: 'This is my first post!',
    created_at: '2024-01-15 10:30:00',
    username: 'john_doe',
    profile_picture: null,
    reaction_count: 5
  },
  // ... more posts
]
```

**SQL Query:**
```sql
SELECT p.*, u.username, u.profile_picture,
       (SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id) as reaction_count
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
```

### Get Posts by User
```javascript
const posts = await getPostsByUser(userId);
```

**Returns:** Array of posts by specific user

## Reaction Operations

### Toggle Reaction (Like/Unlike)
```javascript
const added = await toggleReaction(postId, userId);
```

**Returns:** 
- `true` if reaction was added
- `false` if reaction was removed

**Logic:**
1. Check if reaction exists
2. If exists: remove it (unlike)
3. If not: add it (like)

**SQL Queries:**
```sql
-- Check existing
SELECT * FROM reactions WHERE post_id = ? AND user_id = ?

-- Remove
DELETE FROM reactions WHERE post_id = ? AND user_id = ?

-- Add
INSERT INTO reactions (post_id, user_id) VALUES (?, ?)
```

### Check if User Reacted
```javascript
const hasReacted = await hasUserReacted(postId, userId);
```

**Returns:** `true` or `false`

### Get Reaction Count
```javascript
const count = await getReactionCount(postId);
```

**Returns:** Number of reactions

**SQL Query:**
```sql
SELECT COUNT(*) as count FROM reactions WHERE post_id = ?
```

## Comment Operations

### Create Comment
```javascript
const commentId = await createComment(
  postId,   // integer: post ID
  userId,   // integer: user ID
  content   // string: comment text
);
```

**Example:**
```javascript
await createComment(1, 2, 'Great post!');
// Returns: comment ID
```

### Get Comments by Post
```javascript
const comments = await getCommentsByPost(postId);
```

**Returns:**
```javascript
[
  {
    id: 1,
    post_id: 1,
    user_id: 2,
    content: 'Great post!',
    created_at: '2024-01-15 10:35:00',
    username: 'bob_smith',
    profile_picture: null
  },
  // ... more comments
]
```

**SQL Query:**
```sql
SELECT c.*, u.username, u.profile_picture
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.post_id = ?
ORDER BY c.created_at ASC
```

### Get Comment Count
```javascript
const count = await getCommentCount(postId);
```

**Returns:** Number of comments

## Common Query Patterns

### Authentication Flow
```javascript
// 1. Get user by email
const user = await getUserByEmail(email);

// 2. Verify password
const isValid = await verifyPassword(password, user.password_hash);

// 3. If valid, user is logged in
```

### Send Message Flow
```javascript
// 1. Create message
await createMessage(senderId, receiverId, messageText);

// 2. Reload messages
const messages = await getMessagesBetweenUsers(senderId, receiverId);

// 3. Update UI
```

### Create Post with Metadata Flow
```javascript
// 1. Create post
const postId = await createPost(userId, content);

// 2. Get updated posts with counts
const posts = await getPostsByUser(userId);

// 3. For each post, check if current user reacted
const hasReacted = await hasUserReacted(postId, currentUserId);
```

## Performance Tips

### Indexes
SQLite automatically creates indexes on:
- PRIMARY KEY columns
- UNIQUE columns
- FOREIGN KEY columns (in some cases)

### Efficient Queries

✅ **Good:**
```javascript
// Load with JOIN for related data
const posts = await getAllPosts(); // Includes username via JOIN
```

❌ **Avoid:**
```javascript
// Multiple queries in a loop
const posts = await getAllPosts();
for (let post of posts) {
  const user = await getUserById(post.user_id); // N+1 query problem
}
```

### Transactions
For multiple related operations:
```javascript
// Future enhancement: wrap in transaction
await db.transaction(async (tx) => {
  await createPost(...);
  await createNotification(...);
});
```

## Debugging Queries

### Log Query Results
```javascript
const users = await getAllUsers();
console.log('Users:', JSON.stringify(users, null, 2));
```

### Direct Database Access

On Android emulator:
```bash
adb shell
cd /data/data/host.exp.exponent/databases
sqlite3 messenger.db

-- View all tables
.tables

-- View table structure
.schema users

-- Query data
SELECT * FROM users;
SELECT * FROM messages WHERE sender_id = 1;
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;
```

## Data Validation

Before inserting data, validate:

```javascript
// Email validation
if (!validateEmail(email)) {
  throw new Error('Invalid email');
}

// Username validation
if (!validateUsername(username)) {
  throw new Error('Invalid username');
}

// Password validation
if (!validatePassword(password)) {
  throw new Error('Invalid password');
}
```

## Error Handling

All database operations should be wrapped in try-catch:

```javascript
try {
  const user = await createUser(...);
} catch (error) {
  if (error.message.includes('UNIQUE constraint')) {
    // User already exists
    Alert.alert('Error', 'Email or username already taken');
  } else {
    // Other database error
    console.error('Database error:', error);
    Alert.alert('Error', 'Database operation failed');
  }
}
```

## Common Errors

### UNIQUE Constraint Failed
```
Error: UNIQUE constraint failed: users.email
```
**Solution:** Check if user exists before creating

### Foreign Key Constraint
```
Error: FOREIGN KEY constraint failed
```
**Solution:** Ensure referenced records exist

### Database Not Initialized
```
Error: Database not initialized
```
**Solution:** Wait for database initialization in useEffect

## Best Practices

1. ✅ Always use parameterized queries (prevents SQL injection)
2. ✅ Hash passwords before storing
3. ✅ Validate input before database operations
4. ✅ Use transactions for related operations
5. ✅ Handle errors gracefully with try-catch
6. ✅ Keep queries simple and readable
7. ✅ Use JOINs to avoid N+1 queries
8. ✅ Index frequently queried columns
9. ✅ Test with edge cases (empty strings, null values)
10. ✅ Log errors for debugging

## Future Enhancements

Potential optimizations:
- Add indexes for timestamp columns
- Implement soft deletes (keep deleted records)
- Add query result caching
- Implement database migrations
- Add full-text search indexes
- Optimize with EXPLAIN QUERY PLAN

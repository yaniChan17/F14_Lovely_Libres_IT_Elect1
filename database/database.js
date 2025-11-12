import * as SQLite from 'expo-sqlite';

let db = null;

export const openDatabase = async () => {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('messenger.db');
  await initializeDatabase();
  return db;
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call openDatabase first.');
  }
  return db;
};

const initializeDatabase = async () => {
  try {
    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        profile_picture TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
      );
    `);

    // Create posts table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Create reactions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        type TEXT DEFAULT 'like',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(post_id, user_id)
      );
    `);

    // Create comments table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// User queries
export const createUser = async (username, email, passwordHash, profilePicture = null, status = '') => {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO users (username, email, password_hash, profile_picture, status) VALUES (?, ?, ?, ?, ?)',
    [username, email, passwordHash, profilePicture, status]
  );
  return result.lastInsertRowId;
};

export const getUserByEmail = async (email) => {
  const db = getDatabase();
  const result = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);
  return result;
};

export const getUserByUsername = async (username) => {
  const db = getDatabase();
  const result = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [username]);
  return result;
};

export const getUserById = async (id) => {
  const db = getDatabase();
  const result = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [id]);
  return result;
};

export const getAllUsers = async () => {
  const db = getDatabase();
  const result = await db.getAllAsync('SELECT id, username, email, profile_picture, status FROM users ORDER BY username');
  return result;
};

export const updateUserStatus = async (userId, status) => {
  const db = getDatabase();
  await db.runAsync('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
};

// Message queries
export const createMessage = async (senderId, receiverId, message) => {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [senderId, receiverId, message]
  );
  return result.lastInsertRowId;
};

export const getMessagesBetweenUsers = async (userId1, userId2) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT m.*, u.username as sender_username 
     FROM messages m 
     JOIN users u ON m.sender_id = u.id
     WHERE (m.sender_id = ? AND m.receiver_id = ?) 
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.timestamp ASC`,
    [userId1, userId2, userId2, userId1]
  );
  return result;
};

export const getRecentChats = async (userId) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT DISTINCT 
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END as user_id,
      u.username,
      u.profile_picture,
      u.status,
      MAX(m.timestamp) as last_message_time
    FROM messages m
    JOIN users u ON (
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END = u.id
    )
    WHERE m.sender_id = ? OR m.receiver_id = ?
    GROUP BY user_id
    ORDER BY last_message_time DESC`,
    [userId, userId, userId, userId]
  );
  return result;
};

// Post queries
export const createPost = async (userId, content) => {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO posts (user_id, content) VALUES (?, ?)',
    [userId, content]
  );
  return result.lastInsertRowId;
};

export const getAllPosts = async () => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT p.*, u.username, u.profile_picture,
     (SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id) as reaction_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );
  return result;
};

export const getPostsByUser = async (userId) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT p.*, u.username, u.profile_picture,
     (SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id) as reaction_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result;
};

// Reaction queries
export const toggleReaction = async (postId, userId) => {
  const db = getDatabase();
  
  // Check if reaction exists
  const existing = await db.getFirstAsync(
    'SELECT * FROM reactions WHERE post_id = ? AND user_id = ?',
    [postId, userId]
  );
  
  if (existing) {
    // Remove reaction
    await db.runAsync('DELETE FROM reactions WHERE post_id = ? AND user_id = ?', [postId, userId]);
    return false;
  } else {
    // Add reaction
    await db.runAsync(
      'INSERT INTO reactions (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
    return true;
  }
};

export const hasUserReacted = async (postId, userId) => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    'SELECT * FROM reactions WHERE post_id = ? AND user_id = ?',
    [postId, userId]
  );
  return !!result;
};

export const getReactionCount = async (postId) => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM reactions WHERE post_id = ?',
    [postId]
  );
  return result?.count || 0;
};

// Comment queries
export const createComment = async (postId, userId, content) => {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [postId, userId, content]
  );
  return result.lastInsertRowId;
};

export const getCommentsByPost = async (postId) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT c.*, u.username, u.profile_picture
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return result;
};

export const getCommentCount = async (postId) => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
    [postId]
  );
  return result?.count || 0;
};

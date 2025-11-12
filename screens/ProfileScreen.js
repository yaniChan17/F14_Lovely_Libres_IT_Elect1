import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  getPostsByUser, 
  createPost, 
  toggleReaction, 
  hasUserReacted,
  getCommentsByPost,
  createComment,
  getReactionCount,
  getCommentCount,
  updateUserStatus,
} from '../database/database';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { user, updateUser, logout } = useAuth();

  const loadPosts = async () => {
    try {
      const userPosts = await getPostsByUser(user.id);
      
      // Load reaction status for each post
      const postsWithReactions = await Promise.all(
        userPosts.map(async (post) => {
          const userReacted = await hasUserReacted(post.id, user.id);
          const reactionCount = await getReactionCount(post.id);
          const commentCount = await getCommentCount(post.id);
          return {
            ...post,
            userReacted,
            reaction_count: reactionCount,
            comment_count: commentCount,
          };
        })
      );
      
      setPosts(postsWithReactions);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      await createPost(user.id, newPostContent.trim());
      setNewPostContent('');
      setShowNewPostModal(false);
      await loadPosts();
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleReaction = async (postId) => {
    try {
      await toggleReaction(postId, user.id);
      await loadPosts();
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleShowComments = async (post) => {
    setSelectedPost(post);
    try {
      const postComments = await getCommentsByPost(post.id);
      setComments(postComments);
      setShowCommentsModal(true);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    try {
      await createComment(selectedPost.id, user.id, newComment.trim());
      setNewComment('');
      const updatedComments = await getCommentsByPost(selectedPost.id);
      setComments(updatedComments);
      await loadPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await updateUserStatus(user.id, newStatus.trim());
      await updateUser(user.id);
      setNewStatus('');
      setShowEditStatusModal(false);
      Alert.alert('Success', 'Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>
            {user.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postUsername}>{user.username}</Text>
          <Text style={styles.postTime}>
            {new Date(item.created_at).toLocaleDateString()} at{' '}
            {new Date(item.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleReaction(item.id)}
        >
          <Text style={[styles.actionIcon, item.userReacted && styles.actionIconActive]}>
            {item.userReacted ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{item.reaction_count || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShowComments(item)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comment_count || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.username}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user.username}</Text>
                  <TouchableOpacity onPress={() => {
                    setNewStatus(user.status || '');
                    setShowEditStatusModal(true);
                  }}>
                    <Text style={styles.profileStatus}>
                      {user.status || 'Add a status...'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutIconButton}>
                  <Text style={styles.logoutIcon}>🚪</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.createPostButton}
              onPress={() => setShowNewPostModal(true)}
            >
              <Text style={styles.createPostText}>What's on your mind?</Text>
            </TouchableOpacity>
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Posts</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Create your first post!</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* New Post Modal */}
      <Modal
        visible={showNewPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What's on your mind?"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setNewPostContent('');
                  setShowNewPostModal(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPost]}
                onPress={handleCreatePost}
              >
                <Text style={styles.modalButtonTextPost}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={showCommentsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCommentsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.commentsModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              ListEmptyComponent={
                <View style={styles.emptyCommentsContainer}>
                  <Text style={styles.emptyCommentsText}>No comments yet</Text>
                </View>
              }
              style={styles.commentsList}
            />
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={[styles.commentSendButton, !newComment.trim() && styles.commentSendButtonDisabled]}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Text style={styles.commentSendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        visible={showEditStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What's your status?"
              value={newStatus}
              onChangeText={setNewStatus}
              multiline
              numberOfLines={2}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setNewStatus('');
                  setShowEditStatusModal(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPost]}
                onPress={handleUpdateStatus}
              >
                <Text style={styles.modalButtonTextPost}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  logoutIconButton: {
    padding: 8,
  },
  logoutIcon: {
    fontSize: 24,
  },
  createPostButton: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  createPostText: {
    color: '#666',
    fontSize: 16,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postHeaderInfo: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  actionIconActive: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  commentsModalContent: {
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonPost: {
    backgroundColor: '#0084ff',
  },
  modalButtonTextCancel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPost: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
    marginBottom: 15,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 11,
    color: '#666',
  },
  emptyCommentsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCommentsText: {
    fontSize: 14,
    color: '#666',
  },
  commentInputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
  },
  commentSendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  commentSendButtonDisabled: {
    opacity: 0.5,
  },
  commentSendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

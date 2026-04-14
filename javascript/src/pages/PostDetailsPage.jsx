import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NameInputModal from '../components/NameInputModal';
import { getPost } from '../api/posts';
import { listComments, createComment } from '../api/comments';
import { likePost, unlikePost } from '../api/likes';
import { useAppContext } from '../context/AppContext';

const PostDetailsPage = () => {
  const { postId } = useParams();
  const { username, setUsername, apiAvailable, setApiAvailable } = useAppContext();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([getPost(postId), listComments(postId)]);
      setPost(p);
      setComments(c);
      setApiAvailable(true);
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [postId, setApiAvailable]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async () => {
    if (!username || !post) return;
    try {
      await likePost(post.id, username);
      setPost((p) => ({ ...p, likesCount: p.likesCount + 1 }));
      setApiAvailable(true);
    } catch {
      // attempt unlike
      try {
        await unlikePost(post.id);
        setPost((p) => ({ ...p, likesCount: Math.max(0, p.likesCount - 1) }));
      } catch {
        setApiAvailable(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || submitting || !username) return;
    setSubmitting(true);
    try {
      const newComment = await createComment(postId, username, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setPost((p) => ({ ...p, commentsCount: p.commentsCount + 1 }));
      setCommentText('');
      setApiAvailable(true);
    } catch {
      setApiAvailable(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === 'Enter') handleAddComment();
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {!apiAvailable && (
          <div
            role="alert"
            className="bg-red-500 text-white text-sm text-center py-2 px-4"
          >
            Backend API is currently unavailable or unreachable.
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-8">Loading...</p>
        ) : !post ? (
          <p className="text-center text-gray-400 mt-8">Post not found.</p>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Post header */}
            <div className="bg-amber-500 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="font-semibold text-white text-sm">{post.username}</span>
              </div>
              <p className="text-white text-sm mb-2 pl-10">{post.content}</p>
              <div className="flex items-center gap-4 pl-10">
                <button
                  onClick={handleLike}
                  aria-label={`Like, ${post.likesCount} likes`}
                  tabIndex={0}
                  className="flex items-center gap-1 text-white hover:text-red-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs">{post.likesCount}</span>
                </button>
                <span className="flex items-center gap-1 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span className="text-xs">{post.commentsCount}</span>
                </span>
              </div>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-400 mt-6 text-sm">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 px-4 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.username}</p>
                      <p className="text-sm text-gray-600">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder="Enter comment"
                aria-label="Add a comment"
                maxLength={1000}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddComment}
                aria-label="Submit comment"
                tabIndex={0}
                disabled={!commentText.trim() || submitting}
                className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded flex items-center justify-center text-lg font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {!username && <NameInputModal onSubmit={setUsername} />}
    </div>
  );
};

export default PostDetailsPage;

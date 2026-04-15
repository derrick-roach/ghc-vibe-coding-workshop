import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import NameInputModal from '../components/NameInputModal';
import { listPosts } from '../api/posts';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { username, setUsername, apiAvailable, setApiAvailable } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await listPosts();
      setPosts(data);
      setApiAvailable(true);
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [setApiAvailable]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleUsernameSubmit = (name) => setUsername(name);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikeToggle = (postId, liked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likesCount: p.likesCount + (liked ? 1 : -1) }
          : p
      )
    );
  };

  const handleNewPostClick = () => {
    if (!username) return;
    setShowPostModal(true);
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

        <div className="bg-amber-500 px-4 py-3 text-white font-semibold">
          Hi, there!
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {loading ? (
            <p className="text-center text-gray-400 mt-8">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
              />
            ))
          )}

          <button
            onClick={handleNewPostClick}
            aria-label="Create new post"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNewPostClick()}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 text-2xl transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {!username && <NameInputModal onSubmit={handleUsernameSubmit} />}
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default HomePage;

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import NameInputModal from '../components/NameInputModal';
import { listPosts } from '../api/posts';
import { useAppContext } from '../context/AppContext';

const SearchPage = () => {
  const { username, setUsername, apiAvailable, setApiAvailable } = useAppContext();
  const [query, setQuery] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await listPosts();
      setAllPosts(data);
      setFiltered(data);
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

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(allPosts);
      return;
    }
    setFiltered(
      allPosts.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q)
      )
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLikeToggle = (postId, liked) => {
    const update = (list) =>
      list.map((p) =>
        p.id === postId
          ? { ...p, likesCount: p.likesCount + (liked ? 1 : -1) }
          : p
      );
    setAllPosts((prev) => update(prev));
    setFiltered((prev) => update(prev));
  };

  const handlePostCreated = (newPost) => {
    setAllPosts((prev) => [newPost, ...prev]);
    setFiltered((prev) => [newPost, ...prev]);
    setShowPostModal(false);
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

        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Enter keywords to search..."
            aria-label="Search posts"
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            aria-label="Search"
            tabIndex={0}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {loading ? (
            <p className="text-center text-gray-400 mt-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">No results found.</p>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
              />
            ))
          )}

          <button
            onClick={() => username && setShowPostModal(true)}
            aria-label="Create new post"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && username && setShowPostModal(true)}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 text-2xl transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {!username && <NameInputModal onSubmit={setUsername} />}
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default SearchPage;

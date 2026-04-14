import { useNavigate } from 'react-router-dom';
import { likePost, unlikePost } from '../api/likes';
import { useAppContext } from '../context/AppContext';

const PostCard = ({ post, onLikeToggle }) => {
  const navigate = useNavigate();
  const { username } = useAppContext();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!username) return;
    try {
      await likePost(post.id, username);
      if (onLikeToggle) onLikeToggle(post.id, true);
    } catch {
      // already liked or error — attempt unlike
      try {
        await unlikePost(post.id);
        if (onLikeToggle) onLikeToggle(post.id, false);
      } catch {
        // ignore
      }
    }
  };

  const handleCardClick = () => navigate(`/posts/${post.id}`);

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter') handleCardClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Post by ${post.username}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="bg-amber-500 border-b border-amber-600 p-3 cursor-pointer hover:bg-amber-400 transition-colors"
    >
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
          aria-label={`Like post, ${post.likesCount} likes`}
          tabIndex={0}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') handleLike(e); }}
          className="flex items-center gap-1 text-white hover:text-red-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs">{post.likesCount}</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/posts/${post.id}`); }}
          aria-label={`Comments, ${post.commentsCount} comments`}
          tabIndex={0}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') navigate(`/posts/${post.id}`); }}
          className="flex items-center gap-1 text-white hover:text-blue-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <span className="text-xs">{post.commentsCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;

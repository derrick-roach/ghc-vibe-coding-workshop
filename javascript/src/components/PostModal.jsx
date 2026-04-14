import { useState } from 'react';
import { createPost } from '../api/posts';
import { useAppContext } from '../context/AppContext';

const PostModal = ({ onClose, onPostCreated }) => {
  const { username, setApiAvailable } = useAppContext();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const post = await createPost(username, content.trim());
      setApiAvailable(true);
      if (onPostCreated) onPostCreated(post);
      onClose();
    } catch {
      setApiAvailable(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create a new post"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg p-4 w-72 shadow-lg">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How do you feel today?"
          aria-label="Post content"
          maxLength={2000}
          rows={5}
          className="w-full border border-gray-200 rounded p-2 text-sm resize-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            tabIndex={0}
            aria-label="Submit post"
            disabled={!content.trim() || submitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm py-1.5 rounded transition-colors"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            tabIndex={0}
            aria-label="Cancel"
            className="flex-1 bg-blue-200 hover:bg-blue-300 text-blue-800 text-sm py-1.5 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;

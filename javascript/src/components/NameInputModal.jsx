import { useState } from 'react';

const NameInputModal = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter your username"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div className="bg-white rounded-lg p-6 w-72 shadow-lg">
        <h2 className="text-center text-gray-800 font-semibold mb-4">Enter your username</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="UserName"
          aria-label="Username"
          maxLength={50}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          tabIndex={0}
          aria-label="Confirm username"
          disabled={!value.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm py-2 rounded transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NameInputModal;

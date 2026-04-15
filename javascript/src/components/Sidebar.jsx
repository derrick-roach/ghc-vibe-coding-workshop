import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex flex-col items-center gap-6 py-6 px-3 bg-amber-500 h-full min-h-screen w-14">
      <button
        onClick={() => navigate('/')}
        aria-label="Home"
        tabIndex={0}
        className={`p-2 rounded-full transition-colors ${
          isActive('/') ? 'text-white' : 'text-amber-900 hover:text-white'
        }`}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>

      <button
        onClick={() => navigate('/search')}
        aria-label="Search"
        tabIndex={0}
        className={`p-2 rounded-full transition-colors ${
          isActive('/search') ? 'text-white' : 'text-amber-900 hover:text-white'
        }`}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </button>

      <button
        aria-label="Profile"
        tabIndex={0}
        className="p-2 rounded-full text-amber-900 hover:text-white transition-colors mt-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </button>

      <button
        onClick={() => navigate('/')}
        aria-label="Close"
        tabIndex={0}
        className="p-2 rounded-full text-amber-900 hover:text-white transition-colors"
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;

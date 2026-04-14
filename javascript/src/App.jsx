import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PostDetailsPage from './pages/PostDetailsPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/posts/:postId" element={<PostDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import PlaylistsPage from './pages/PlayLists';
import Contact from './pages/Contact';
import Support from './pages/Support';
import SharedPlaylistPage from './pages/SharedPlaylists';
import Register from './pages/Register';
import { ToastBar, Toaster } from 'react-hot-toast';
import PublicPlaylists from './pages/PublicPlaylists';

// 🔒 Protected Route Component (generic, reusable)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or get from context / cookie
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/shared-playlist/:id" element={<SharedPlaylistPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/support" element={<Support />} />
          <Route path='/public-playlists' element={<PublicPlaylists />} />
          {/* 🔐 Protected route: only logged-in users can access */}
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
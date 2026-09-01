import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import PlaylistsPage from './pages/PlayLists';
import Contact from './pages/Contact';
import Support from './pages/Support';
import SharedPlaylistPage from './pages/SharedPlaylists';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import PublicPlaylists from './pages/PublicPlaylists';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user?.user || state.userLogin?.user || null);
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token || user);

  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

const PublicOnlyRoute = ({ children }) => {
  const user = useSelector((state) => state.user?.user || state.userLogin?.user || null);
  const token = localStorage.getItem('token');

  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shared-playlist/:id" element={<SharedPlaylistPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route path="/support" element={<Support />} />
          <Route path="/public-playlists" element={<PublicPlaylists />} />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
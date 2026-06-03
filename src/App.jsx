import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import PlaylistsPage from './pages/PlayLists';
import Contact from './pages/Contact';
import Support from './pages/Support'; // Importing the new Support page
import SharedPlaylistPage from './pages/SharedPlaylists';
import Register from './pages/Register';
import { ToastBar, Toaster } from 'react-hot-toast';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/support" element={<Support />} /> {/* New route for Support page */}
        </Routes>
      </Router>
    </>
  );
}

export default App;


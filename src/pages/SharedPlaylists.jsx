import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../actions/userAction';
import { URL } from '../constants/userConstants';
import { Button } from '@/components/ui/button';

const SharedPlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await API.get(`${URL}/clips/playlists/${id}`);
        setPlaylist(res.data);
      } catch (err) {
        setError('Playlist not found or inaccessible.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading playlist...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!playlist) return null;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
          🎬 Shared Playlist: {playlist.title}
        </h1>
        <Link to="/">
          <Button className="text-sm">🏠 Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlist.videos.map((clip, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            <video
              src={`${URL}/mockvideos/${clip.clip}`}
              controls
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <p className="font-semibold text-gray-800">🏏 {clip.batsman}</p>
              <p className="text-sm text-gray-600">🎯 vs {clip.bowler}</p>
              <p className="text-sm text-gray-500">📌 {clip.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedPlaylistPage;
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2, PlayCircle, Download } from "lucide-react";
import { NEW_URL, URL } from "./../constants/userConstants"; // Add URL if not present
import { API } from "../actions/userAction"; // Make sure this is the correct import

const PlaylistsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [expandedPlaylist, setExpandedPlaylist] = useState(null);
    const [selectedClips, setSelectedClips] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState('240p');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [editableClips, setEditableClips] = useState([]);
    const [showMobileModal, setShowMobileModal] = useState(false);

    const videoSrc = `${NEW_URL}/${selectedQuality == '240p' ? 'mockvideos' : selectedQuality == '360p' ? '360p' : '720p'}`;

    // Fetch playlists from backend on mount
    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleDelete = async (playlist) => {
        if (window.confirm(`Delete playlist "${playlist.title}"?`)) {
            try {
                await API.delete(`${URL}/clips/playlists/delete/${playlist?._id}`);

            } catch (e) {
                alert("Failed to delete playlist.");
            }
        }
    };

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const res = await API.get(`${URL}/clips/playlists/all`);
            // Expecting res.data to be an array of { title, videos }
            const loaded = {};
            (res.data || []).forEach(pl => {
                if (pl.title && Array.isArray(pl.videos)) loaded[pl.title] = pl.videos;
            });
            setPlaylists([...res?.data]);
        } catch (e) {
            setPlaylists({});
        }
        setLoading(false);
    };

    const handleDownloadAll = (clips) => {
        clips.forEach((clip) => {
            const link = document.createElement("a");
            link.href = `${NEW_URL}/mockvideos/${clip.clip}`;
            link.download = clip.clip;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handleMergeAndDownload = async (clips) => {
        setLoading(true)
        const response = await fetch(`${NEW_URL}/auth/merge-clips`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clips: clips?.map((m) => m.clip), quality: selectedQuality }),
        });
        const res = await response.json()
        const downloadUrl = `${videoSrc}/${res.file}`;
        const a = document.createElement('a');
        a.target = '_blank';
        a.href = downloadUrl;
        a.download = res.file;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoading(false)
    };

    const handleSave = async () => {
        try {
            await API.put(`${URL}/clips/playlists/update/${editingPlaylist?._id}`, {
                title: newTitle,
                videos: editableClips.map(c => c._id || c.clip || c),
            });
            // Refetch playlists after save
            const res = await API.get(`${URL}/clips/playlists/all`);
            const loaded = {};
            (res.data || []).forEach(pl => {
                if (pl.title && Array.isArray(pl.videos)) loaded[pl.title] = pl.videos;
            });
            setPlaylists([...res.data]);
            setIsEditing(false);
        } catch (e) {
            alert("Failed to save playlist.");
        }
    };

    const handleShare = (playlist) => {
        const shareableUrl = `${window.location.origin}/shared-playlist/${playlist._id}`;
        navigator.clipboard.writeText(shareableUrl);
        alert('Playlist link copied to clipboard!');
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">🎬 Your Playlists</h1>
                <Button onClick={() => navigate(-1)} className="text-sm">
                    🔙 Back
                </Button>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center">Loading playlists...</p>
            ) : Object.keys(playlists).length === 0 ? (
                <p className="text-gray-500 text-center">No playlists found.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 p-4 min-h-screen bg-gradient-to-br from-blue-50 to-white">
                {/* Left Sidebar: Playlists */}
                <div className="sm:w-1/3 w-full space-y-4">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist?._id}
                            className="border border-blue-200 rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition duration-200"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-sm font-semibold text-blue-800 truncate w-full">
                                        🎬 {playlist?.title}
                                    </h2>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                        {playlist?.videos?.length} clip{playlist?.videos?.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setExpandedPlaylist(playlist);
                                            setSelectedClips(playlist?.videos);
                                            if (window.innerWidth < 640) {
                                                setShowMobileModal(true);
                                            }
                                        }}
                                        className="flex text-sm px-1 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition"
                                        title="View playlist clips"
                                    >
                                        👁️ View
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleMergeAndDownload(playlist.videos)
                                        }}
                                        className="flex flex-row text-sm px-1 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition"
                                        title="Download all clips"
                                    >
                                        📥 Download
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditingPlaylist(playlist);
                                            setNewTitle(playlist?.title);
                                            setEditableClips([...playlist?.videos]);
                                        }}
                                        className="text-sm px-1 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(playlist)}
                                        className="text-sm px-1 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
                                        title="Delete playlist"
                                    >
                                        🗑️ Delete
                                    </button>
                                    <button
                                        onClick={() => handleShare(playlist)}
                                        className="flex text-sm px-1 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
                                        title="Delete playlist"
                                    >
                                        🔗 Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Panel: Clips */}
                <div className="sm:w-2/3 w-full border border-blue-200 rounded-lg p-4 bg-white shadow-sm">
                    {expandedPlaylist ? (
                        <>
                            <h3 className="text-lg font-bold text-blue-700 mb-3">
                                🎥 Clips in "{expandedPlaylist?.title}"
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {selectedClips?.map((clip, i) => (
                                    <div
                                        key={i}
                                        className="relative rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition"
                                    >
                                        <video
                                            src={`${NEW_URL}/mockvideos/${clip?.clip}`}
                                            controls
                                            className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                                        />
                                        <div className="text-xs sm:text-sm p-2 group-hover:opacity-100 transition">
                                            <p className="truncate font-semibold" title={clip.batsman}>
                                                🏏 {clip.batsman}
                                            </p>
                                            <p className="truncate" title={`vs ${clip.bowler}`}>
                                                🎯 vs {clip.bowler}
                                            </p>
                                            <p className="truncate" title={clip.event}>
                                                📌 {clip.event}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-600 italic">
                            Click a playlist to view its clips.
                        </p>
                    )}
                </div>
            </div>
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4 relative">
                        <h2 className="text-xl font-bold text-blue-800">Edit Playlist</h2>

                        {/* Playlist Title Rename */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Rename Playlist</label>
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        {/* Clip List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {editableClips.map((clip, index) => (
                                <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
                                    <p className="font-semibold text-base sm:text-sm text-blue-900">{clip.batsman}</p>
                                    <p className="text-xs sm:text-sm font-medium text-blue-600">{clip.event}</p>
                                    <button
                                        onClick={() => {
                                            setEditableClips(editableClips.filter((_, i) => i !== index));
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        ❌ Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                ✅ Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showMobileModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-4 space-y-4 relative shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-blue-800">🎥 {expandedPlaylist}</h2>
                            <button
                                onClick={() => setShowMobileModal(false)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ✖️
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {selectedClips.map((clipUrl, i) => (
                                <video
                                    key={i}
                                    src={`${NEW_URL}/mockvideos/${clipUrl.clip || clipUrl}`}
                                    controls
                                    className="rounded-lg shadow"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PlaylistsPage;

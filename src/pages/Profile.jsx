import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, ArrowLeft, FolderKanban, Clapperboard, PlayCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API, loadUser } from '../actions/userAction';
import { URL } from '../constants/userConstants';

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user || state.userLogin?.user || null);
    const [playlists, setPlaylists] = useState([]);
    const [playlistLoading, setPlaylistLoading] = useState(false);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?._id) {
                setPlaylists([]);
                return;
            }

            try {
                setPlaylistLoading(true);
                const res = await API.get(`${URL}/clips/playlists/all`, {
                    params: { createdBy: user._id },
                });
                setPlaylists(res.data || []);
            } catch (error) {
                setPlaylists([]);
            } finally {
                setPlaylistLoading(false);
            }
        };

        fetchPlaylists();
    }, [user?._id]);

    const displayName = user?.username || user?.name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || 'No email available';
    const totalClips = playlists.reduce((sum, playlist) => sum + (Array.isArray(playlist.videos) ? playlist.videos.length : 0), 0);
    const recentPlaylists = playlists.slice(0, 3);

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 pb-10">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <User size={28} />
                        </div>
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Profile access</p>
                        <h1 className="mt-3 text-3xl font-bold text-slate-900">Please log in</h1>
                        <p className="mt-3 text-slate-600">
                            You need to sign in to view your profile, saved playlists, and cricket clip collections.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-full p-3">
                                <User className="text-white" size={30} />
                            </div>
                            <div className="text-white">
                                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Profile</p>
                                <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3 text-slate-500">
                                    <User size={18} />
                                    <span className="text-sm font-medium uppercase tracking-wide">Name</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-800">{displayName}</p>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3 text-slate-500">
                                    <Mail size={18} />
                                    <span className="text-sm font-medium uppercase tracking-wide">Email</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-800 break-all">{email}</p>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                            <div className="flex items-center gap-3 mb-3 text-slate-700">
                                <ShieldCheck size={18} />
                                <span className="text-sm font-medium uppercase tracking-wide">Account status</span>
                            </div>
                            <p className="text-lg font-semibold text-emerald-600">Active</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Your account is ready to manage playlists, saved clips, and your cricket content workspace.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-blue-700">
                                    <FolderKanban size={18} />
                                    <span className="text-sm font-semibold uppercase tracking-wide">Playlists</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-800">{playlists.length}</p>
                            </div>

                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-indigo-700">
                                    <Clapperboard size={18} />
                                    <span className="text-sm font-semibold uppercase tracking-wide">Saved clips</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-800">{totalClips}</p>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                    <PlayCircle size={18} />
                                    <span className="text-sm font-semibold uppercase tracking-wide">Status</span>
                                </div>
                                <p className="text-lg font-bold text-slate-800">{playlists.length ? 'Ready to watch' : 'Start creating'}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="text-xl font-bold text-slate-800">Your playlists</h2>
                                <button
                                    onClick={() => navigate('/playlists')}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Open all
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            {playlistLoading ? (
                                <p className="text-sm text-slate-500">Loading playlists...</p>
                            ) : recentPlaylists.length > 0 ? (
                                <div className="space-y-3">
                                    {recentPlaylists.map((playlist) => (
                                        <div key={playlist._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-slate-800">{playlist.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {Array.isArray(playlist.videos) ? playlist.videos.length : 0} clips
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/playlists')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                                    <p className="text-slate-600">No playlists yet.</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Create your first playlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

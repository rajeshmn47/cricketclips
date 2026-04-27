import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Filter, Search } from 'lucide-react';
import Filters from '../components/Filters';
import { Switch } from '../components/ui/switch';
import { API } from '../actions/userAction';
import { HTTPS_URL, NEW_URL, URL } from '../constants/userConstants';
import axios from 'axios';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import VideoTrimmer from '../VideoTrimmer';
import { inferDismissals } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../actions/userAction';
import cricketSynonyms from '../utils/cricket_synonyms.json';
import exclusionMap from '../utils/exclusion_map.json';
import { useNavigate } from 'react-router-dom';

const filters = [
  'Match', 'Player', 'Shot Type', 'Over', 'Ball', 'Batting Team', 'Bowler', 'Striker', 'Non-Striker',
  'Fielder', 'Wicket', 'Runs', 'Boundary', 'Sixes', 'Powerplay', 'Match Type', 'Pitch Type',
  'Weather', 'Match Date', 'League'
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState();
  const [filterValues, setFilterValues] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Simulating super admin status
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [isEditClipOpen, setIsEditClipOpen] = useState(false);
  const [selectedClipIds, setSelectedClipIds] = useState([]);
  const [trimmingClip, setTrimmingClip] = useState(null);
  const editClipForm = useRef(null);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const navigate = useNavigate();
  const [selectedQuality, setSelectedQuality] = useState('240p');
  const videoRef = useRef(null);
  const videoSrc = `${NEW_URL}/${selectedQuality == '240p' ? 'mockvideos' : selectedQuality == '360p' ? '360p' : '720p'}`;
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState({}); // legacy, not used for backend
  const [backendPlaylists, setBackendPlaylists] = useState([]); // backend playlists
  const [totalPages, setTotalPages] = useState(0);
  const [allPlayers, setAllPlayers] = useState([]);
  const [showMoreCommentary, setShowMoreCommentary] = useState(null);

  // Fetch backend playlists for the logged-in user
  useEffect(() => {
    const fetchBackendPlaylists = async () => {
      if (!user?._id) {
        setBackendPlaylists([]);
        return;
      }
      try {
        const res = await API.get(`${URL}/clips/playlists/all`, {
          params: { createdBy: user._id },
        });
        setBackendPlaylists(res.data || []);
      } catch (err) {
        setBackendPlaylists([]);
      }
    };
    fetchBackendPlaylists();
  }, [user]);

  useEffect(() => {
    async function getPlayers() {
      const { data } = await API.get(`${URL}/clips/all_players`)
      setAllPlayers([...data])
    }
    getPlayers()
  }, [])

  const filteredClips = clips

  // Calculate paginated clips
  const paginatedClips = clips;

  // Only show admin controls if user is logged in and user.role is 'admin'
  const isAdmin = user && user.role === "user";
  console.log(user, 'user')

  useEffect(() => {
    dispatch(loadUser());
    fetchClips();
  }, [dispatch, currentPage, filterValues, itemsPerPage]);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const params = {
        ...filterValues,
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      };
      const res = await API.get(`${URL}/clips/all_clips`, { params });
      //const clipsWithDuration = await Promise.all(
      //  res.data.map((clip) => getClipWithDuration(clip))
      //);
      const enhancedClips = res.data.clips.map((clip) => {
        const inferred = inferDismissals(clip?.event, clip.commentary || "")
        return { ...clip, ...inferred }
      })
      setClips(enhancedClips);
      setTotalPages(res.data.totalPages)
      //setClips(clipsWithDuration);
    } catch (err) {
      console.error("Error fetching clips:", err);
    } finally {
      setLoading(false);
    }
  };

  const getClipWithDuration = (clip) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = `${URL}/mockvideos/${clip.clip}`;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({ ...clip, duration: video.duration });
      };
      video.onerror = () => {
        // fallback in case video fails to load
        resolve({ ...clip, duration: 0 });
      };
    });
  };

  const handleFilterChange = (key, value) => {
    console.log(key, value, 'key')
    setFilterValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchClips();
  };

  const handleDownloadSelected = () => {
    selectedClipIds.forEach((clip) => {
      const link = document.createElement("a");
      link.href = `${URL}/mockvideos/${clip}`;
      link.download = clip;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleMergeAndDownload = async () => {
    setLoading(true)
    const selectedClipsObjects = selectedClipIds
    const response = await fetch(`${NEW_URL}/auth/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clips: selectedClipsObjects, quality: selectedQuality }),
    });
    console.log(response, 'res');
    const res = await response.json()
    console.log(res, 'res');
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

  const videos = Array.from({ length: 10 }).map((_, idx) => ({
    id: idx,
    title: `Clip ${idx + 1}`,
    videoUrl: `https://www.example.com/clip${idx + 1}.mp4`,
  }));

  const handleEditSave = (updatedClip) => {
    // Mock request delay
    setTimeout(() => {
      setClips(prev =>
        prev.map(c => c.clip === updatedClip.clip ? updatedClip : c)
      )
      alert("Clip updated (mock)")
    }, 300)
  }

  const toggleSelecte = (clip) => {
    console.log(clip, selectedClipIds, 'toggle clip')
    setSelectedClipIds(prev =>
      prev.find((p) => p.clip == clip.clip)
        ? prev.filter(cl => cl.clip !== clip.clip)
        : [...prev, clip]
    )
  }

  const toggleSelect = (clip) => {
    console.log(clip, selectedClipIds, 'toggle clip')
    setSelectedClipIds((prev) =>
      prev.find((p) => p == clip) // use unique id
        ? prev.filter((cl) => cl !== clip)
        : [...prev, clip]
    );
    console.log('completed toggle')
  };

  const deleteSelected = async () => {
    if (!confirm("Delete all selected clips?")) return
    setTimeout(() => {
      setClips(prev => prev.filter(c => !selectedClipIds.includes(c.clip)))
      setSelectedClipIds([])
    }, 300)
    await axios.post(`${URL}/auth/delete-multiple`, { clips: selectedClipIds })
  }

  const handleDelete = async (clip) => {
    //if (!confirm("Delete all selected clips?")) return
    await axios.delete(`${URL}/auth/delete-clip/${clip._id}`);
    setClips(prev => prev.filter(c => c._id !== clip._id));
  }

  const handleAddToPlayliste = () => {
    if (!playlistName || selectedClipIds.length === 0) return;

    // Example: Save to localStorage or backend
    const existing = JSON.parse(localStorage.getItem(playlistName)) || [];
    localStorage.setItem(
      playlistName,
      JSON.stringify([...existing, ...selectedClipIds])
    );

    setPlaylistName("");
    setShowPlaylistModal(false);
    alert("Clips added to playlist!");
  };

  const handleAddToPlaylistee = () => {
    const finalName =
      playlistName === "__new__" ? newPlaylistName.trim() : playlistName;

    if (!finalName) {
      alert("Please enter a valid playlist name.");
      return;
    }

    // Get existing clips (if any)
    const existingClips = JSON.parse(localStorage.getItem(finalName) || "[]");

    // Merge and deduplicate
    const updatedClips = Array.from(new Set([...existingClips, ...selectedClipIds]));

    // Save back to localStorage
    localStorage.setItem(finalName, JSON.stringify(updatedClips));

    // Reset
    setPlaylistName("");
    setNewPlaylistName("");
    setShowPlaylistModal(false);
  };

  // Add clips to backend playlist (create or update)
  const handleAddToPlaylist = async () => {
    const finalName =
      playlistName === "__new__" ? newPlaylistName.trim() : playlistName;

    if (!finalName) {
      alert("Please enter a valid playlist name.");
      return;
    }

    try {
      await API.post(`${URL}/clips/playlists/create`, {
        title: finalName,
        videos: selectedClipIds,
        createdBy: user?._id,
      });
      // Refetch playlists after saving
      const res = await API.get(`${URL}/clips/playlists/all`, {
        params: user?._id ? { createdBy: user._id } : undefined,
      });
      setBackendPlaylists(res.data || []);

      setPlaylistName("");
      setNewPlaylistName("");
      setShowPlaylistModal(false);
      alert("Playlist saved to backend!");
    } catch (err) {
      alert("Failed to save playlist to backend.");
    }
  };


  //console.log(filterValues, clips, 'filterValues');
  //console.log(filteredClips, 'filteredClips');

  return (
    <div className="p-3 sm:p-4 space-y-4 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-blue-100/80 to-white/80 shadow-md border border-blue-100 mb-2">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 drop-shadow-sm text-center sm:text-left tracking-tight leading-tight mb-1">Cricket Clips Dashboard</h1>
          <span className="text-xs sm:text-sm text-blue-700 font-medium tracking-wide opacity-80">AI-powered search &amp; video management</span>
        </div>
        <form
          onSubmit={(e) => handleSearch(e)}
          className="flex items-center w-full sm:w-auto max-w-lg bg-white/90 rounded-lg shadow-sm border border-blue-200 px-2 py-1 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
        >
          <Search className="text-blue-400 mr-2 w-5 h-5" />

          <Input
            placeholder="Search clips, players, events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm sm:text-base placeholder:text-blue-300"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Search
          </button>
        </form>
      </div>
      {/* Video Quality Selector */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-4 flex-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Video Quality:</label>
          <select
            className="p-2 border border-gray-300 rounded bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm w-full xs:w-auto"
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
          >
            <option value="720p">High (720p)</option>
            <option value="360p">Medium (360p)</option>
            <option value="240p">Low (240p)</option>
          </select>
          <Button
            variant="outline"
            onClick={() => navigate("/playlists")}
            className="text-sm w-full"
          >
            🎬 View Playlists
          </Button>
          <Button
            variant="ghost"
            disabled={selectedClipIds.length === 0}
            onClick={() => setShowPlaylistModal(true)}
            className="bg-green-100 text-green-700 hover:bg-green-200 text-xs sm:text-base w-full xs:w-full"
          >
            ➕ Add to Playlist
          </Button>
        </div>
        <div className="flex flex-col xs:flex-row flex-wrap gap-2 flex-1 justify-end">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Select All:</label>
          <div className="flex gap-2 justify-between">
            {/* Select All Button */}
            <Button
              variant="outline"
              disabled={selectedClipIds.length === filteredClips?.length}
              onClick={() => setSelectedClipIds(filteredClips.map((clip) => clip.clip))}
              className="border-blue-300 hover:bg-blue-50 text-xs sm:text-base w-1/2"
            >
              Select All
            </Button>

            {/* Deselect All Button */}
            <Button
              variant="outline"
              disabled={selectedClipIds.length === 0}
              onClick={() => setSelectedClipIds([])}
              className="border-red-300 hover:bg-red-50 text-xs sm:text-base w-1/2"
            >
              Deselect All
            </Button>
          </div>
          <Button
            variant="secondary"
            disabled={selectedClipIds.length === 0}
            onClick={handleDownloadSelected}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base w-full xs:w-auto"
          >
            📥 Download Selected
          </Button>
          <Button
            variant="default"
            disabled={selectedClipIds.length === 0}
            onClick={handleMergeAndDownload}
            className="bg-blue-500 text-white hover:bg-blue-600 text-xs sm:text-base w-full xs:w-auto"
          >
            🎞️ Combine & Download
          </Button>
        </div>
      </div>
      <Filters values={filterValues} onChange={handleFilterChange} clips={clips} players={allPlayers} />
      {isAdmin && selectedClipIds.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            className="text-white bg-red-500 border border-red-300 hover:bg-red-600 text-xs sm:text-base"
            onClick={deleteSelected}
          >
            Delete Selected ({selectedClipIds.length})
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          {itemsPerPage * totalPages} item{filteredClips.length !== 1 && "s"} selected
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700 font-medium">Items per page:</label>
          <select
            id="itemsPerPage"
            className="p-1 border border-gray-300 rounded bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 text-xs sm:text-base"
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on change
            }}
          >
            {[6, 12, 24, 48, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {paginatedClips.map(clip => (
          <Card key={clip._id} className="relative shadow-lg hover:shadow-2xl transition-shadow bg-white/90 border-blue-100">
            {/*<a
              target='__blank'
              href={`${URL}/mockvideos/${clip.clip}`}
              className="underline text-blue-700 hover:text-blue-900 break-all"
              style={{ wordBreak: 'break-all' }}
            >
              {`${URL}/mockvideos/${clip.clip}`}
            </a>*/}
            <video key={clip._id + selectedQuality} ref={videoRef} controls className="w-full rounded-t-xl aspect-video bg-black min-h-[180px] sm:min-h-[220px] md:min-h-[240px]">
              <source src={`${videoSrc}/${clip.clip}`} type="video/mp4" />
            </video>
            <CardContent className='relative space-y-1 pt-2'>
              <p className="font-semibold text-base sm:text-lg text-blue-900">{clip.batsman}</p>
              <p className="text-xs sm:text-sm text-gray-600">vs {clip.bowler}</p>
              <p className="text-xs sm:text-sm font-medium text-blue-600">{clip.event}</p>
              <div className='flex flex-wrap gap-2'>
                {clip?.labels?.shotType && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.shotType?.split('_').join(' ')}
                </Button>}
                {clip?.labels?.ballType && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.ballType?.split('_').join(' ')}</Button>}
                {clip?.labels?.direction && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.direction?.split('_').join(' ')}
                </Button>}
                {clip?.labels?.connection && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.connection?.split('_').join(' ')}
                </Button>}
                {clip?.labels?.lofted && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.lofted && 'lofted'}
                </Button>}
                {clip?.labels?.slowball && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.slowball && 'slow ball'}
                </Button>}
                {clip?.labels?.lengthType && <Button variant="secondary"
                  size="sm"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base">
                  {clip?.labels?.lengthType && clip?.labels?.lengthType?.split('_').join(' ')}
                </Button>}
              </div>
              {/*<p className="font-semibold">{clip.duration}</p>*/}
              <Checkbox
                checked={selectedClipIds.includes(clip._id)}
                onCheckedChange={() => toggleSelect(clip._id)}
                className="absolute top-2 right-2 border border-blue-400 bg-white/80"
              />
              {isAdmin && (
                <div className="flex gap-2 mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-blue-300 text-xs sm:text-base">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <EditClipForm clip={clip} onSave={handleEditSave} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    className='text-white bg-red-500 border border-red-300 hover:bg-red-600 text-xs sm:text-base'
                    onClick={() => handleDelete(clip)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-base"
                    onClick={() => setTrimmingClip(clip)}
                  >
                    ✂️ Trim
                  </Button>
                </div>
              )}
              <p className="text-xs sm:text-sm text-gray-500">
                {clip?.commentary && clip.commentary.length > 120 ? (
                  <>
                    {showMoreCommentary === clip._id
                      ? clip.commentary
                      : `${clip.commentary.slice(0, 120)}... `}
                    <button
                      className="text-blue-600 underline ml-1"
                      onClick={() =>
                        setShowMoreCommentary(
                          showMoreCommentary === clip._id ? null : clip._id
                        )
                      }
                      type="button"
                    >
                      {showMoreCommentary === clip._id ? "Less" : "More"}
                    </button>
                  </>
                ) : (
                  clip?.commentary
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        (() => {
          // Compute a compact list of pages to show: first, last, and a window around currentPage (+2 pages after)
          const maxDisplay = 7;
          const visible = [];
          if (totalPages <= maxDisplay) {
            for (let i = 1; i <= totalPages; i++) visible.push(i);
          } else {
            visible.push(1);
            if (currentPage > 3) visible.push('left-ellipsis');
            // Show currentPage, and two pages after it (if available)
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 2);
            for (let i = start; i <= end; i++) visible.push(i);
            if (currentPage < totalPages - 3) visible.push('right-ellipsis');
            visible.push(totalPages);
          }

          return (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              <Button
                variant="outline"
                className="px-2 sm:px-3 py-1 text-xs sm:text-base"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>

              {visible.map((p, idx) =>
                p === 'left-ellipsis' || p === 'right-ellipsis' ? (
                  <span key={`ell-${idx}`} className="px-2 text-sm">...</span>
                ) : (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-base ${currentPage === p ? "bg-blue-500 text-white" : "hover:bg-blue-50"
                      }`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                className="px-2 sm:px-3 py-1 text-xs sm:text-base"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                Next
              </Button>
            </div>
          );
        })()
      )}
      {trimmingClip && (
        <Dialog open={!!trimmingClip} onOpenChange={() => setTrimmingClip(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Trim Clip</DialogTitle>
              <DialogDescription>Adjust the start and end time before trimming.</DialogDescription>
            </DialogHeader>
            <VideoTrimmer
              videoFileUrl={`${URL}/mockvideos/${trimmingClip.clip}`}
              onClose={() => setTrimmingClip(null)}
            />
          </DialogContent>
        </Dialog>
      )}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add to Playlist</h2>

            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Select or create playlist
            </label>
            <select
              className="w-full border px-3 py-2 rounded mb-2"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            >
              <option value="">-- Select Playlist --</option>
              {backendPlaylists.map((pl) => (
                <option key={pl._id} value={pl.title}>
                  {pl.title}
                </option>
              ))}
              <option value="__new__">➕ Create New Playlist</option>
            </select>

            {playlistName === "__new__" && (
              <input
                type="text"
                placeholder="Enter New Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowPlaylistModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddToPlaylist}
                disabled={
                  playlistName === "" ||
                  (playlistName === "__new__" && !newPlaylistName.trim())
                }
              >
                ➕ Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditClipForm({ clip, onSave }) {
  const [form, setForm] = useState({ ...clip })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="space-y-4">
      <Input name="batsman" value={form.batsman} onChange={handleChange} placeholder="Batsman" />
      <Input name="bowler" value={form.bowler} onChange={handleChange} placeholder="Bowler" />
      <Input name="event" value={form.event} onChange={handleChange} placeholder="Event" />
      <Input name="over" value={form.over} onChange={handleChange} placeholder="Over" />
      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
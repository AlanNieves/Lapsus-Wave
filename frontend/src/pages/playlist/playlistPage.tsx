import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-tarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Song } from "@/types";
import { toast } from "react-hot-toast";
import { Plus, Search, Save } from "lucide-react";
import axios from "axios";

// Componente de diálogo para añadir canciones (definido primero)
const AddSongsDialog = ({
  open,
  onOpenChange,
  selectedSongs,
  onSelect
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSongs: string[];
  onSelect: (songs: string[]) => void;
}) => {
  const { songs } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((song: Song) => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (songId: string) => {
    onSelect(
      selectedSongs.includes(songId)
        ? selectedSongs.filter(id => id !== songId)
        : [...selectedSongs, songId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Songs</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-lapsus-500" />
            <Input
              placeholder="Search songs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-96 pr-4">
            {filteredSongs.map((song: Song) => (
              <div
                key={song._id}
                className={`p-3 rounded-md flex items-center justify-between cursor-pointer ${
                  selectedSongs.includes(song._id) 
                    ? 'bg-lapsus-900' 
                    : 'hover:bg-lapsus-800'
                }`}
                onClick={() => toggleSelection(song._id)}
              >
                <div className="flex items-center gap-4">
                  <img src={song.imageUrl} alt={song.title} className="h-10 w-10 rounded-sm" />
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-lapsus-500">{song.artist}</p>
                  </div>
                </div>
                <div className={`h-5 w-5 rounded-full border ${
                  selectedSongs.includes(song._id)
                    ? 'bg-lapsus-500 border-lapsus-500'
                    : 'border-lapsus-500'
                }`}>
                  {selectedSongs.includes(song._id) && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const isEditMode = playlistId === "new";
  const isCreating = !playlistId;

  // Stores
  const { getToken } = useAuth();
  const { currentPlaylist, fetchPlaylistById } = usePlaylistStore();

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null as File | null,
    isPublic: true,
    songs: [] as string[]
  });

  const [showAddSongs, setShowAddSongs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playlistId && playlistId !== "new") {
      fetchPlaylistById(playlistId);
    }
    
    if (isEditMode && currentPlaylist) {
      setFormData({
        name: currentPlaylist.name,
        description: currentPlaylist.description,
        coverImage: null,
        isPublic: currentPlaylist.isPublic,
        songs: currentPlaylist.songs.map((s: Song) => s._id)
      });
    }

  }, [playlistId, currentPlaylist, fetchPlaylistById, isEditMode]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("isPublic", String(formData.isPublic));
    formData.songs.forEach(songId => formPayload.append("songs", songId));
    
    if (formData.coverImage) {
      formPayload.append("coverImage", formData.coverImage);
    }

    try {
      const token = await getToken();
      const method = isCreating ? "POST" : "PUT";
      const url = isCreating ? "/api/playlists" : `/api/playlists/${playlistId}`;

      const response = await axios({
        method,
        url,
        data: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/playlists/${response.data._id}`);
      toast.success(isCreating ? "Playlist created!" : "Playlist updated!");
    } catch (error) {
      toast.error("Error saving playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <div className="p-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex gap-6">
          <div className="w-48 h-48 border-2 border-dashed border-lapsus-500 rounded-lg flex items-center justify-center">
            <label className="cursor-pointer text-center p-4">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && 
                  setFormData({...formData, coverImage: e.target.files[0]})
                }
              />
              {formData.coverImage ? (
                <img 
                  src={URL.createObjectURL(formData.coverImage)} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-lapsus-500">
                  {currentPlaylist?.coverImage ? "Change Cover" : "Upload Cover Image"}
                </span>
              )}
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <Input
              placeholder="Playlist Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="h-4 w-4 text-lapsus-500 focus:ring-lapsus-500 border-lapsus-300 rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-lapsus-400">
                Public Playlist
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowAddSongs(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Songs
          </Button>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : isCreating ? "Create Playlist" : "Save Changes"}
          </Button>
        </div>
      </form>

      <AddSongsDialog 
        open={showAddSongs}
        onOpenChange={setShowAddSongs}
        selectedSongs={formData.songs}
        onSelect={songs => setFormData({...formData, songs})}
      />
    </div>
  );

  return (
    <div className="flex h-full">
      {isCreating || isEditMode ? renderForm() : (
        <div className="flex-1">
          {/* Vista de visualización de playlist */}
          <div className="p-6">
            <h1 className="text-2xl font-bold">{currentPlaylist?.name}</h1>
            <p className="text-lapsus-500 mt-2">{currentPlaylist?.description}</p>
            
            <div className="mt-6">
              {currentPlaylist?.songs?.map((song: Song) => (
                <div key={song._id} className="p-3 hover:bg-lapsus-800 rounded-md">
                  <div className="flex items-center gap-4">
                    <img src={song.imageUrl} alt={song.title} className="h-12 w-12 rounded-md" />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-lapsus-500">{song.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
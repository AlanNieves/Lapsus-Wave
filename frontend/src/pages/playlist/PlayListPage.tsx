import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-tarea";
import SongOptionsMenu from "@/layout/components/SongMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Clock, Play, Pause } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Music } from "lucide-react";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaylistPage = () => {
  const { currentPlaylist } = useMusicStore();
  const { playlistId } = useParams();
  const { playlists, updatePlaylist, deletePlaylist, reproducePlaylist, currentSong, togglePlay, isPlaying, isMenuOpen, setIsMenuOpen } = usePlayerStore();
  const playlist = playlists.find((p) => p.id === playlistId);
  const navigate = useNavigate();

  const [name, setName] = useState(playlist?.name || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [imageUrl, setImageUrl] = useState(playlist?.imageUrl || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description || "");
      setImageUrl(playlist.imageUrl || "");
    }
  }, [playlist]);

  const handleSave = () => {
    if (playlist) {
      updatePlaylist(playlist.id, { name, description, imageUrl });
      setIsEditing(false);
    }
  };

  const handlePlay = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else {
      reproducePlaylist(currentPlaylist?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;
    reproducePlaylist(currentPlaylist?.songs, index);
  };

  const handleDelete = () => {
    if (playlist) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleAddSong = () => {
    setIsAddSongModalOpen(true);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!playlist) {
    return <div className="p-6">Playlist not found</div>;
  }

  return (
    <div className="p-6">
      {/* Encabezado de la playlist */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-48 h-48 rounded-lg bg-gradient-to-br from-lapsus-500 to-lapsus-800 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={playlist.name}
            className="w-full h-full rounded-lg object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleEditImage}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button
            onClick={() => document.getElementById("image-upload")?.click()}
            className="absolute bottom-2 right-2 bg-lapsus-1000/80 p-2 rounded-full text-lapsus-500 hover:text-lapsus-300"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Playlist name"
                className="text-3xl font-bold"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="text-lapsus-800"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Delete Playlist
                </Button>

              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{playlist.name}</h1>
              <p className="text-lapsus-800">{playlist.description}</p>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)}>Edit Playlist</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Playlist
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <div className="px-6 pb-4 flex items-center gap-6">
            <Button
              onClick={handlePlay}
              size="icon"
              className="w-14 h-14 rounded-full bg-lapsus-1200 hover:bg-lapsus- hover:scale-105 transition-all"
            >
              {isPlaying &&
                currentPlaylist?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                <Pause className="h-7 w-7 text-lapsus-500" />
              ) : (
                <Play className="h-7 w-7 text-lapsus-500" />
              )}
            </Button>
          </div>
          <h2 className="text-xl font-bold">Songs</h2>
          <Button onClick={handleAddSong}>Add Song</Button>
        </div>
        {playlist.songs.length === 0 ? (
          <div className="text-center text-lapsus-800 py-4">Empty</div>
        ) : (
          <div className="bg-black/20 backdrop-blur-sm">
            <div className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-10 py-2 text-sm text-lapsus-100">
              <div>#</div>
              <div>Title</div>
              <div>Added Date</div>
              <div>
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="px-6">
              <div className="space-y-2 py-4">
                {currentPlaylist?.songs.map((song, index) => {
                  const isCurrentSong = currentSong?._id === song._id;
                  return (
                    <div
                      key={`${song._id}-${index}`}
                      onMouseLeave={() => {
                        if (isMenuOpen) {
                          setIsMenuOpen(false);
                        }
                      }}
                      className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-4 py-2 text-sm text-lapsus-800 hover:bg-lapsus-1000 rounded-md group cursor-pointer"
                    >
                      <div
                        className="flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(index);
                        }}
                      >
                        {isCurrentSong && isPlaying ? (
                          <div className="size-4 text-lapsus-1100">♫</div>
                        ) : (
                          <span className="group-hover:hidden">{index + 1}</span>
                        )}
                        {!isCurrentSong && (
                          <Play className="h-4 w-4 hidden group-hover:block" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10"
                        />

                        <div>
                          <div className="font-medium text-lapsus-500">
                            {song.title}
                          </div>
                          <div>{song.artist}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {song.createdAt.split("T")[0]}
                      </div>
                      <div className="flex items-center">
                        {formatDuration(song.duration)}
                      </div>
                      <div
                        className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        // Evitamos que el clic en los tres puntos se propague a la fila (para que no se dispare el onDoubleClick)
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SongOptionsMenu song={song} playlistId={""} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar canciones */}
      {isAddSongModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-lapsus-1000 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add Song</h2>
            {/* Aquí puedes agregar un buscador de canciones */}
            <Button onClick={() => setIsAddSongModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;



import { useState } from "react";
import { useParams } from "react-router-dom";

import PlaylistHeader from "@/components/playlist/PlaylistHeader";
import PlaylistSongsTable from "@/components/playlist/PlaylistSongsTable";
import AddSongToPlaylist from "@/components/playlist/AddSongToPlaylist";

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistVersion, setPlaylistVersion] = useState(0); // para recargar canciones

  if (!id) return <div className="text-white p-6">Playlist no encontrada</div>;

  return (
    <div
      className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide bg-gradient-to-b from-lapsus-1200/30 via-lapsus-1000/20 to-lapsus-900 px-4 sm:px-8 py-6"
      style={{ scrollbarWidth: "none" }} // Firefox
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      <div className="flex flex-col gap-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-6">
        <PlaylistHeader
          playlistId={id}
          onOpenAddSongModal={() => setIsModalOpen(true)}
        />

        {isModalOpen && (
          <AddSongToPlaylist
            playlistId={id}
            onClose={() => setIsModalOpen(false)}
            onSongAdded={() => {
              setPlaylistVersion((v) => v + 1); // recargar canciones
              setIsModalOpen(false);
            }}
          />
        )}

        <PlaylistSongsTable key={playlistVersion} playlistId={id} />
      </div>
    </div>
  );
};

export default PlaylistPage;

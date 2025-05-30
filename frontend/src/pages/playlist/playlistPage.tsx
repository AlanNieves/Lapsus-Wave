import { useState } from "react";
import { useParams } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import PlaylistHeader from "@/components/playlist/PlaylistHeader";
import PlaylistSongsTable from "@/components/playlist/PlaylistSongsTable";
import AddSongToPlaylist from "@/components/playlist/AddSongToPlaylist";

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistVersion, setPlaylistVersion] = useState(0); // para recargar canciones

  if (!id) return <div className="text-white p-6">Playlist no encontrada</div>;

  return (
    <>
      <SignedIn>
        <div className="flex flex-col h-full">
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

          {/* ✅ Scroll estilizado oscuro */}
          <div
            className="overflow-y-auto px-6 scrollbar scrollbar-thumb-pink-900 scrollbar-track-transparent"
            style={{ maxHeight: "calc(100vh - 350px)" }}
          >
            <PlaylistSongsTable key={playlistVersion} playlistId={id} />
          </div>

        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default PlaylistPage;

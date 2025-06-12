import { useMusicStore } from "@/stores/useMusicStore";
import { Link } from "react-router-dom";

const PlaylistDropdown = () => {
  const playlists = useMusicStore((state) => state.playlists);
  console.log("Dropdown renderizado", playlists);

  return (
    <div className="flex flex-col gap-2">
      {playlists.length === 0 ? (
        <span className="text-white text-sm">No playlists</span>
      ) : (
        playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlists/${playlist._id}`}
            className="text-white text-sm hover:bg-white/10 p-2 rounded-md"
          >
            {playlist.name}
          </Link>
        ))
      )}
    </div>
  );
};

export default PlaylistDropdown;

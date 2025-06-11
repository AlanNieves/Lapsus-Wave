import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";

const AllPlaylistsPage = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const token = await getToken();
                const { data } = await axiosInstance.get("/playlists", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setPlaylists(data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, []);

    console.log("🎧 Playlist images:", playlists.map(p => p.coverImage));

    return (
        <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900'>
            <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-6">Tus Playlists</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            onClick={() => navigate(`/playlists/${playlist._id}`)}
                            className="cursor-pointer hover:scale-105 transition-transform bg-lapsus-800 rounded-lg p-3 shadow-md"
                        >
                            <img
                                src={
                                    playlist.coverImage
                                        ? playlist.coverImage.startsWith("http")
                                            ? playlist.coverImage
                                            : `${BASE_URL}/uploads/${playlist.coverImage}`
                                        : "/placeholder.png"
                                }
                                alt={playlist.name}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.png";
                                }}
                                className="w-full h-40 object-cover rounded-md"
                            />


                            <div className="mt-2 font-semibold">{playlist.name}</div>
                            <p className="text-sm text-lapsus-300 line-clamp-2">{playlist.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default AllPlaylistsPage;
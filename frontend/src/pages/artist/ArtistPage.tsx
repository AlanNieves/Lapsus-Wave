import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Play, Heart } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface Artist {
  _id: string;
  name: string;
  image?: string;
  followers?: number;
}

interface Song {
  _id: string;
  title: string;
  imageUrl: string;
  duration: number;
  audioUrl: string;
}

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const resArtist = await axiosInstance.get(`/artists/${artistId}`);
        const resSongs = await axiosInstance.get(`/songs/by-artist/${artistId}`);

        setArtist(resArtist.data);
        setSongs(resSongs.data);
      } catch (error) {
        console.error("Error loading artist page:", error);
      }
    };

    if (artistId) fetchArtistData();
  }, [artistId]);

  if (!artist) return <div className="text-white p-6">Cargando artista...</div>;

  return (
    <div className="text-white">
      {/* ENCABEZADO DEL ARTISTA CON BLUR Y ESTILO DESTACADO */}
      <div className="relative rounded-lg overflow-hidden mb-10">
        <div
          className="absolute inset-0 bg-cover bg-center blur-md opacity-30"
          style={{
            backgroundImage: `url(${artist.image || "/default-artist.jpg"})`,
          }}
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          <img
            src={artist.image || "/default-artist.jpg"}
            alt={artist.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
          />
          <h1 className="text-5xl font-bold mt-4 text-white">{artist.name}</h1>
          <p className="text-zinc-300 text-sm mt-1">
            {artist.followers?.toLocaleString() || 0} seguidores
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-gray-200 transition">
              <Play size={20} /> Reproducir
            </button>
            <button className="border border-white px-6 py-2 rounded-full text-white flex items-center gap-2 font-medium hover:bg-white/10 transition">
              <Heart size={20} /> Seguir
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE CANCIONES */}
      <div className="px-6">
        <h2 className="text-2xl font-semibold mb-4">Canciones</h2>
        {songs.length === 0 ? (
          <p className="text-gray-400">Este artista no tiene canciones aún.</p>
        ) : (
          <ul className="space-y-2">
            {songs.map((song, index) => (
              <li
                key={song._id}
                className="flex items-center justify-between bg-zinc-800 p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span>
                    {index + 1}. {song.title}
                  </span>
                </div>
                <span>
                  {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;

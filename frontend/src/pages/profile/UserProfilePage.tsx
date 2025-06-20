import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios"; // ✅ instancia personalizada
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Playlist } from "@/types";

interface User {
  _id: string;
  nickname: string;
  lapsusId: string;
  email: string;
  image?: string;
  bio?: string;
  tags?: string[];
  lastSong?: string;
  cover?: string;
}

interface Post {
  _id: string;
  image: string;
  description: string;
  createdAt: string;
  userId: {
    _id: string;
    nickname: string;
    image?: string;
  };
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${id}`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        console.error("Error al cargar el perfil del usuario", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get(`/posts`, {
          withCredentials: true,
        });
        setPosts(data.filter((p: Post) => p.userId?._id === id));
      } catch (err) {
        console.error("Error al cargar posts", err);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const { data } = await axiosInstance.get(`/playlists/user/${id}`, {
          withCredentials: true,
        });
        setPlaylists(data);
      } catch (err) {
        console.error("Error al obtener playlists", err);
      }
    };

    fetchUser();
    fetchPosts();
    fetchPlaylists();
  }, [id]);

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#2c0e25] via-[#1c0b1a] to-[#0f0f0f] text-white overflow-x-hidden pb-40">
      <div className="relative w-full h-64">
        <img
          src={user.cover || "/default-cover.jpg"}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        <div className="flex-1 flex gap-8 items-start -mt-24">
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-[#A64D79] overflow-hidden group bg-black">
              <img
                src={user.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 w-full">
              <Button className="w-full bg-[#A64D79] hover:bg-[#6A1E55] text-white">
                Seguir
              </Button>
              <Button
                variant="secondary"
                className="w-full border-lapsus-1100 text-white hover:bg-lapsus-1100/40"
                onClick={() => navigate(`/messages?to=${user._id}`)}
              >
                Mensaje
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-start mt-20">
            <h1 className="text-3xl font-bold">{user.nickname}</h1>
            <p className="text-lapsus-300 text-sm">@{user.lapsusId}</p>
            <p className="text-lapsus-400 text-sm">{user.bio || "Sin biografía"}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {user.tags?.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-lapsus-1100 text-white text-xs border border-lapsus-300 px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-xs text-lapsus-400 mt-4">
              Última canción escuchada: <span className="text-lapsus-500 font-semibold">{user.lastSong || "N/A"}</span>
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Publicaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div key={post._id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={post.userId?.image || "/default-avatar.png"}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p className="text-sm font-semibold text-white">
                        {post.userId?.nickname || "Usuario eliminado"}
                      </p>
                    </div>
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-60 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-white">{post.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[200px]">
          <h2 className="text-white text-lg font-bold mb-4">PLAYLISTS</h2>
          <div className="flex flex-col gap-2">
            {playlists.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/playlists/${p._id}`)}
                className="bg-lapsus-1250 text-white text-sm py-2 px-3 rounded hover:bg-lapsus-1100 cursor-pointer border border-white/20"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

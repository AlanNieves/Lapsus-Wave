import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchUserPlaylists } from "@/services/userProfile.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Playlist, User, Post } from "@/types";
import axios from "axios";

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followerUsers, setFollowerUsers] = useState<User[]>([]);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        const meRes = await axios.get(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });

        const [userData, userPlaylists] = await Promise.all([
          fetchUserProfile(id),
          fetchUserPlaylists(id),
        ]);
        setUser(userData);
        setPlaylists(userPlaylists);

        if (userData.followers?.includes(meRes.data._id)) {
          setIsFollowing(true);
        }

        const postRes = await axios.get(`${BASE_URL}/posts`, { withCredentials: true });
        setPosts(postRes.data.filter((p: Post) => p.userId?._id === id));
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, BASE_URL]);

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/follow/${id}`, {}, {
        withCredentials: true,
      });
      setIsFollowing(res.data.following);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              followers: res.data.following
                ? [...(prev.followers || []), "temp"]
                : (prev.followers || []).slice(0, -1),
            }
          : prev
      );
    } catch (err) {
      console.error("Error al seguir usuario:", err);
    }
  };

  const loadFollowerUsers = async () => {
    if (!user?.followers || user.followers.length === 0) return;
    try {
      const results = await Promise.all(
        user.followers.map((followerId) =>
          axios.get(`${BASE_URL}/users/${followerId}`, { withCredentials: true })
        )
      );
      const followerData = results.map((res) => res.data);
      setFollowerUsers(followerData);
    } catch (error) {
      console.error("Error al cargar seguidores:", error);
    }
  };

  const handleShowFollowers = async () => {
    setShowFollowers(true);
    await loadFollowerUsers();
  };

  if (loading) return <div className="text-center text-white py-10">Cargando perfil...</div>;
  if (!user) return <div className="text-center text-red-400 py-10">Usuario no encontrado</div>;

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-b from-[#2c0e25] via-[#1c0b1a] to-[#0f0f0f] text-white pb-40">
      <div className="relative w-full h-64">
        <img src={user.cover || "/default-cover.jpg"} alt="Cover" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        <div className="flex-1 flex gap-8 items-start -mt-24">
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-[#A64D79] overflow-hidden bg-black">
              <img src={user.image || "/default-avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="mt-6 flex flex-col gap-2 w-full">
              <Button
                onClick={handleFollowToggle}
                className={`w-full text-white transform transition-all duration-300 ${
                  isFollowing ? "bg-green-700 hover:bg-green-600 scale-100" : "bg-[#A64D79] hover:bg-[#6A1E55] scale-105"
                }`}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
              <Button
                variant="outline"
                className="w-full border-lapsus-1100 text-white hover:bg-lapsus-1100/40"
                onClick={() => navigate(`/chat/${id}`)}
              >
                Send message
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-start mt-20">
            <h1 className="text-3xl font-bold">{user.nickname}</h1>
            <p className="text-lapsus-300 text-sm">@{user.lapsusId}</p>
            <p className="text-lapsus-400 text-sm">{user.bio || "Sin biografía"}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {user.tags?.map((tag, i) => (
                <Badge key={i} className="bg-lapsus-1100 text-white text-xs border border-lapsus-300 px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            <p
              className="text-sm text-lapsus-300 mt-2 cursor-pointer hover:underline"
              onClick={handleShowFollowers}
            >
              Seguidores: <span className="text-white font-semibold">{user.followers?.length || 0}</span>
            </p>

            <p className="text-xs text-lapsus-400 mt-4">
              Última canción escuchada: <span className="text-lapsus-500 font-semibold">{user.lastSong || "N/A"}</span>
            </p>

            {showFollowers && (
              <div className="absolute z-50 top-20 left-1/2 transform -translate-x-1/2 bg-black border border-white/20 rounded-xl w-96 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Seguidores</h3>
                  <button onClick={() => setShowFollowers(false)} className="text-red-400 hover:underline">Cerrar</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {followerUsers.length > 0 ? (
                    followerUsers.map((follower) => (
                      <p key={follower._id} className="text-white text-sm border-b border-white/10 py-1">
                        @{follower.nickname || follower.email}
                      </p>
                    ))
                  ) : (
                    <p className="text-lapsus-400 text-sm">No tiene seguidores aún.</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Publicaciones</h3>
              {posts.length === 0 ? (
                <p className="text-lapsus-400">No ha publicado nada aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={post.userId?.image || "/default-avatar.png"} alt="User" className="w-8 h-8 rounded-full object-cover" />
                        <p className="text-sm font-semibold text-white">
                          {post.userId?.nickname || "Usuario eliminado"}
                        </p>
                      </div>
                      <img src={post.image} alt="Post" className="w-full h-60 object-cover rounded mb-2" />
                      <p className="text-sm text-white">{post.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
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

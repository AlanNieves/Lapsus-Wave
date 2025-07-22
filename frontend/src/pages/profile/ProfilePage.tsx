import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Playlist, UserPost } from "@/types";

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



const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postDescription, setPostDescription] = useState("");
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputCoverRef = useRef<HTMLInputElement | null>(null);
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });
        setUser(data);
        setNickname(data.nickname);
        setBio(data.bio);
        setTags(Array.isArray(data.tags) ? data.tags : []);
      } catch {
        navigate("/login");
      }
    };

    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/playlists`, {
          withCredentials: true,
        });
        setPlaylists(data);
      } catch (err) {
        console.error("Error al obtener playlists", err);
      }
    };

    fetchUser();
    fetchPlaylists();
  }, [navigate, BASE_URL]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/posts`, {
          withCredentials: true,
        });
        setPosts(data.filter((p: UserPost) => p.userId?._id === user?._id));
      } catch (err) {
        console.error("Error al cargar posts", err);
      }
    };

    if (user?._id) {
      fetchPosts();
    }
  }, [user?._id, BASE_URL]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const res = await axios.post(`${BASE_URL}/users/upload-cover`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => (prev ? { ...prev, cover: res.data.cover } : prev));
    } catch (err) {
      console.error("Error al subir portada", err);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axios.post(`${BASE_URL}/users/upload-avatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => (prev ? { ...prev, image: res.data.image } : prev));
    } catch (err) {
      console.error("Error al subir avatar", err);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        e.currentTarget.value = "";
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/users/update`, { nickname, bio, tags }, {
        withCredentials: true,
      });
      setUser((prev) => (prev ? { ...prev, nickname, bio, tags } : prev));
      setIsEditing(false);
    } catch (err) {
      console.error("Error actualizando perfil", err);
    }
  };

  const handleCreatePost = async () => {
    if (!postImage) return;
    const formData = new FormData();
    formData.append("image", postImage);
    formData.append("description", postDescription);
    try {
      await axios.post(`${BASE_URL}/posts`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPostDescription("");
      setPostImage(null);
      setShowPostForm(false);
      alert("✅ Publicación creada");
      const { data } = await axios.get(`${BASE_URL}/posts`, { withCredentials: true });
      setPosts(data.filter((p: UserPost) => p.userId?._id === user?._id));
    } catch (err) {
      console.error("Error creando post", err);
    }
  };

  if (!user) return null;

  return (
    <div className="rounded-xl w-full h-screen overflow-y-auto scrollbar-hide bg-gradient-to-b from-[#120b1d] via-[#0d0b14] to-[#0b0b0b] text-white pb-40 border border-white/20">
      <div className="relative w-full h-64">
        <img
          src={user.cover || "/default-cover.jpg"}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          onClick={() => inputCoverRef.current?.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={inputCoverRef}
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        <div className="flex-1 flex gap-8 items-start -mt-24">
          <div className="flex flex-col items-center">
            <div
              className="relative w-36 h-36 rounded-full border-4 border-white/20 overflow-hidden group backdrop-blur-md bg-white/5 shadow-lg cursor-pointer"
              onClick={() => inputFileRef.current?.click()}
            >
              <img
                src={user.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 w-full">
              {isEditing ? (
                <Button onClick={handleSave} className="w-full">Guardar</Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </Button>
              )}
              <Button
                variant="secondary"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => navigate("/library")}
              >
                Ver biblioteca
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-start mt-20">
            {isEditing ? (
              <>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="text-2xl font-semibold bg-transparent border-b border-white focus:outline-none"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent border-b border-white text-sm focus:outline-none"
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{user.nickname}</h1>
                <p className="text-purple-300 text-sm">@{user.lapsusId}</p>
                <p className="text-purple-300 text-sm">{user.bio || "Sin biografía"}</p>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-white/10 backdrop-blur-sm text-white text-xs border border-white/20 px-3 py-1"
                >
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && (
                <input
                  type="text"
                  placeholder="Nuevo tag"
                  className="bg-transparent border-b border-white text-sm text-white outline-none"
                  onKeyDown={handleAddTag}
                  ref={tagInputRef}
                />
              )}
            </div>

            <p className="text-xs text-purple-300 mt-4">
              Última canción escuchada:{" "}
              <span className="text-purple-300 font-semibold">{user.lastSong || "N/A"}</span>
            </p>

            <div className="mt-8 w-full">
              {!showPostForm ? (
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => setShowPostForm(true)}
                >
                  Crear publicación
                </Button>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-2">Nueva publicación</h3>
                  <div className="bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10 w-full">
                    <div className="mb-2 flex items-center gap-2">
                      <button
                        onClick={() => document.getElementById("post-image-input")?.click()}
                        className="text-white hover:text-purple-300 transition"
                        title="Subir imagen"
                      >
                        📷 Elegir imagen
                      </button>
                      <span className="text-sm text-gray-400">
                        {postImage ? postImage.name : "No se eligió ninguna imagen"}
                      </span>
                      <input
                        id="post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    <textarea
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                      placeholder="Escribe una descripción..."
                      className="w-full bg-transparent border-b border-white text-sm text-white mb-2 outline-none"
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={handleCreatePost}
                        disabled={!postImage}
                        className="bg-purple-700 hover:bg-purple-600"
                      >
                        Publicar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPostForm(false);
                          setPostDescription("");
                          setPostImage(null);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Mis publicaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white/5 backdrop-blur p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={post.userId?.image || "/default-avatar.png"}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p className="text-sm font-semibold">{post.userId?.nickname}</p>
                    </div>
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-60 object-cover rounded mb-2"
                    />
                    <p className="text-sm">{post.description}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-20">
            <h2 className="text-lg font-bold mb-4 whitespace-nowrap">MIS PLAYLIST</h2>
            <div className="flex flex-col gap-2">
              {playlists.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/playlists/${p._id}`)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur rounded py-2 px-3 cursor-pointer border border-white/10"
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

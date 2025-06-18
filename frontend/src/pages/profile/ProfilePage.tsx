import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

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

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#2c0e25] via-[#1c0b1a] to-[#0f0f0f] text-white overflow-x-hidden">
      <div className="relative w-full h-64">
        <img
          src={user.cover || "/default-cover.jpg"}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
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
              className="relative w-36 h-36 rounded-full border-4 border-[#A64D79] overflow-hidden group bg-black cursor-pointer"
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
                  className="w-full border-lapsus-1100 text-white hover:bg-lapsus-1100/40"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </Button>
              )}
              <Button
                variant="secondary"
                className="w-full bg-[#A64D79] hover:bg-[#6A1E55] text-white"
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
                  className="w-full bg-transparent border-b border-lapsus-300 text-sm focus:outline-none"
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{user.nickname}</h1>
                <p className="text-lapsus-300 text-sm">@{user.lapsusId}</p>
                <p className="text-lapsus-400 text-sm">{user.bio || "Sin biografía"}</p>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-lapsus-1100 text-white text-xs border border-lapsus-300 px-3 py-1 flex items-center gap-2"
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
                  className="bg-transparent border-b border-lapsus-300 text-sm text-white outline-none"
                  onKeyDown={handleAddTag}
                  ref={tagInputRef}
                />
              )}
            </div>

            <p className="text-xs text-lapsus-400 mt-4">
              Última canción escuchada:{" "}
              <span className="text-lapsus-500 font-semibold">{user.lastSong || "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="w-[200px]">
          <h2 className="text-white text-lg font-bold mb-4">MIS PLAYLIST</h2>
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

export default ProfilePage;

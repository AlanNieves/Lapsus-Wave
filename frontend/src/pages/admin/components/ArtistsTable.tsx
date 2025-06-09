import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react"; // 🔧 Quitado Plus porque no se usa
import { Input } from "@/components/ui/input";
import AddArtistDialog from "./AddArtistDialog";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";


interface Artist {
  _id: string;
  name: string;
  image: string;
  followers: number;
}

const ArtistsTable = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { getToken } = useAuth();

  const [editValues, setEditValues] = useState<{ name: string; followers: number }>({
    name: "",
    followers: 0,
  });

  const fetchArtists = async () => {
    try {
      const res = await axiosInstance.get("/artists");
      setArtists(res.data);
    } catch {
      toast.error("Error loading artists");
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/artists/${id}`);
      toast.success("Artist deleted");
      fetchArtists();
    } catch {
      toast.error("Failed to delete artist");
    }
  };

  const startEdit = (artist: Artist) => {
    setEditingId(artist._id);
    setEditValues({ name: artist.name, followers: artist.followers });
  };

  const saveEdit = async (id: string) => {
  try {
    const token = await getToken();
    await axiosInstance.put(
      `/artists/${id}`,
      editValues,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Artist updated");
    setEditingId(null);
    fetchArtists();
  } catch (err) {
     console.error(err);
    toast.error("Failed to update artist");
  }
};


  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Artists</h2>
        <AddArtistDialog />
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-700">
        <table className="w-full text-sm">
          <thead className="bg-lapsus-1000 text-left text-lapsus-500">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Followers</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist._id} className="border-t border-zinc-700">
                <td className="p-3">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${artist.image}`}
                    alt={artist.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  {editingId === artist._id ? (
                    <Input
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    />
                  ) : (
                    artist.name
                  )}
                </td>
                <td className="p-3">
                  {editingId === artist._id ? (
                    <Input
                      type="number"
                      value={editValues.followers}
                      onChange={(e) =>
                        setEditValues({ ...editValues, followers: Number(e.target.value) })
                      }
                    />
                  ) : (
                    artist.followers
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  {editingId === artist._id ? (
                    <Button size="sm" onClick={() => saveEdit(artist._id)}>
                      Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => startEdit(artist)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(artist._id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtistsTable;

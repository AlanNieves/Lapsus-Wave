import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const AddArtistDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [followers, setFollowers] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!name || !image) {
      toast.error("Please enter a name and upload an image");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("followers", followers || "0");
      formData.append("imageFile", SelectedImage); // clave usada en backend

      await axiosInstance.post("/artists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Artist created successfully");

      setName("");
      setFollowers("");
      setImage(null);
      setDialogOpen(false);
    } catch (err: any) {
      toast.error("Failed to create artist: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lapsus-1000 hover:bg-lapsus-1100 text-lapsus-500">
          <Upload className="mr-2 h-4 w-4" />
          Add Artist
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-b from-black border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
          <DialogDescription>Fill out the artist information below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Followers (optional)</label>
            <Input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />

            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-lapsus-1000 rounded-lg cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
            >
              <div className="text-center">
                {image ? (
                  <div className="space-y-2">
                    <div className="text-sm text-emerald-500">Image selected:</div>
                    <div className="text-xs text-lapsus-500">{image.name.slice(0, 30)}</div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-lapsus-1000 rounded-full inline-block mb-2">
                      <Upload className="h-6 w-6 text-lapsus-500" />
                    </div>
                    <div className="text-sm text-zinc-400 mb-2">Upload profile image</div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistDialog;

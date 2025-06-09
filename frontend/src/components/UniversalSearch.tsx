import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useSearchStore } from "@/stores/useSearchStore";

interface SongOrAlbum {
  _id: string;
  title: string;
  artist?: string;
  type: "song" | "album";
  imageUrl?: string;
}

interface UniversalSearchProps {
  items?: SongOrAlbum[];
  onResultSelect?: (item: SongOrAlbum) => void;
  placeholder?: string;
  className?: string;
}

const UniversalSearch: React.FC<UniversalSearchProps> = ({
  items,
  onResultSelect,
  placeholder = "Buscar canciones o álbumes...",
  className = "",
}) => {
  // Si no se pasan items, usar canciones del store
  const { songs } = useMusicStore();
  const { searchTerm, setSearchTerm, setShowSearch, showSearch } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Si items no viene por props, usamos las canciones del store y las adaptamos
  const data: SongOrAlbum[] =
    items ||
    songs.map((song) => ({
      ...song,
      type: "song",
    }));

  const [searchQuery, setSearchQuery] = useState(searchTerm);

  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showSearch, setShowSearch, setSearchTerm]);

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchTerm(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-2 text-sm bg-lapsus-1250/80 border border-lapsus-1200/50 rounded-full focus:outline-none focus:ring-2 focus:ring-lapsus-1100/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
        />
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-lapsus-300 cursor-pointer transition-colors"
          onClick={() => inputRef.current?.focus()}
          role="button"
          tabIndex={0}
        />
      </div>
      {searchQuery && (
        <div className="absolute w-full mt-2 bg-lapsus-1250/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-lapsus-1200/30 z-50">
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-3 hover:bg-lapsus-1100/10 transition-colors cursor-pointer border-b border-lapsus-1200/20 last:border-0 flex items-center gap-3"
                onClick={() => onResultSelect?.(item)}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-10 rounded-md object-cover border border-lapsus-1200/30"
                  />
                )}
                <div className="flex-1">
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {item.type === "album" ? "Álbum" : "Canción"}
                    {item.artist ? ` • ${item.artist}` : ""}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-3 text-gray-400 text-sm">Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalSearch;
import React, { useState, useRef, useEffect } from 'react';
import { Search } from "lucide-react";

interface Track {
  _id: string;
  title: string;
  artist: string;
  duration: string;
  imageUrl?: string;
}

interface SearchComponentProps {
  tracks: Track[];
  onResultSelect: (track: Track) => void;
  placeholder?: string;
  className?: string;
}

const MusicSearch: React.FC<SearchComponentProps> = ({
  tracks,
  onResultSelect,
  placeholder = 'Buscar en el álbum...',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasPressedEnter, setHasPressedEnter] = useState(false);

  const filteredTracks = tracks.filter(track => {
    const searchLower = searchQuery.toLowerCase();
    return track.title.toLowerCase().startsWith(searchLower);
  });

  const handleResultSelect = (track: Track) => {
    onResultSelect(track);
    setSearchQuery('');
    setHasPressedEnter(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setHasPressedEnter(true);
      
      // Selección automática si hay un solo resultado
      if (filteredTracks.length === 1) {
        handleResultSelect(filteredTracks[0]);
      }
    }
  };

  useEffect(() => {
    // Selección automática al escribir si hay un único resultado y se presionó Enter
    if (hasPressedEnter && filteredTracks.length === 1) {
      handleResultSelect(filteredTracks[0]);
    }
  }, [searchQuery, hasPressedEnter]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
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
        <div className="absolute w-full mt-2 bg-lapsus-1250/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-lapsus-1200/30">
          <div className="max-h-60 overflow-y-auto">
            {filteredTracks.map(track => (
              <div
                key={track._id}
                className="p-3 hover:bg-lapsus-1100/10 transition-colors cursor-pointer border-b border-lapsus-1200/20 last:border-0"
                onClick={() => handleResultSelect(track)}
              >
                <div className="flex items-center gap-3">
                  {track.imageUrl && (
                    <img 
                      src={track.imageUrl} 
                      alt={track.title}
                      className="w-10 h-10 rounded-md object-cover border border-lapsus-1200/30"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      <span className="text-white">
                        {track.title.substring(0, searchQuery.length)}
                      </span>
                      <span className="text-gray-400">
                        {track.title.substring(searchQuery.length)}
                      </span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {track.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
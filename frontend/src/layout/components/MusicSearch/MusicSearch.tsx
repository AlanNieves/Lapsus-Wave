// MusicSearch.tsx
import React, { useState } from 'react';

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
  placeholder = 'Buscar canciones...',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracks.filter(track => {
    const searchLower = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().startsWith(searchLower) ||
      track.artist.toLowerCase().startsWith(searchLower)
    );
  });

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 text-sm bg-lapsus-1250/80 border border-lapsus-1200/50 rounded-full focus:outline-none focus:ring-2 focus:ring-lapsus-1100/30 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
      />
      
      {searchQuery && (
        <div className="absolute w-full mt-2 bg-lapsus-1250/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-lapsus-1200/30">
          <div className="max-h-60 overflow-y-auto">
            {filteredTracks.map(track => {
              const titleMatch = track.title.toLowerCase().startsWith(searchQuery.toLowerCase());
              
              return (
                <div
                  key={track._id}
                  className="p-3 hover:bg-lapsus-1100/10 transition-colors cursor-pointer border-b border-lapsus-1200/20 last:border-0"
                  onClick={() => onResultSelect(track)}
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
                        {titleMatch ? (
                          <>
                            <span className="text-white">
                              {track.title.substring(0, searchQuery.length)}
                            </span>
                            <span className="text-gray-400">
                              {track.title.substring(searchQuery.length)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">{track.title}</span>
                        )}
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
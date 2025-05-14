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
  placeholder = '¿Qué canción buscas?',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracks.filter(track => {
    const searchLower = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(searchLower) ||
      track.artist.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full p-4 text-sm bg-lapsus-1250/80 border border-lapsus-1200/50
          rounded-full focus:outline-none focus:ring-2 focus:ring-lapsus-1100/30
          focus:border-lapsus-1100 text-lapsus-500 placeholder-lapsus-400
          backdrop-blur-sm transition-all shadow-lg hover:shadow-lapsus-1100/20
          font-medium tracking-wide
        `}
      />
      
      {searchQuery && (
        <div className="absolute w-full mt-2 bg-lapsus-1250/90 backdrop-blur-lg rounded-xl shadow-3d overflow-hidden border border-lapsus-1200/30 animate-smoke">
          <div className="max-h-60 overflow-y-auto">
            {filteredTracks.map(track => {
              const titleMatch = track.title.toLowerCase().indexOf(searchQuery.toLowerCase());
              const artistMatch = track.artist.toLowerCase().indexOf(searchQuery.toLowerCase());
              
              return (
                <div
                  key={track._id}
                  className="p-3 hover:bg-lapsus-1100/10 transition-colors cursor-pointer border-b border-lapsus-1200/20 last:border-0 group"
                  onClick={() => onResultSelect(track)}
                >
                  <div className="flex gap-3 items-center">
                    {track.imageUrl && (
                      <img 
                        src={track.imageUrl} 
                        alt={track.title}
                        className="w-10 h-10 rounded-md object-cover border border-lapsus-1200/30"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-lapsus-500 font-medium truncate">
                        {titleMatch > -1 ? (
                          <>
                            <span className="text-lapsus-400/70">{track.title.substring(0, titleMatch)}</span>
                            <span className="text-lapsus-1100 font-bold">
                              {track.title.substring(titleMatch, titleMatch + searchQuery.length)}
                            </span>
                            <span className="text-lapsus-400/70">{track.title.substring(titleMatch + searchQuery.length)}</span>
                          </>
                        ) : (
                          track.title
                        )}
                      </p>
                      <p className="text-lapsus-400/60 text-xs mt-1 truncate">
                        {artistMatch > -1 ? (
                          <>
                            <span>{track.artist.substring(0, artistMatch)}</span>
                            <span className="text-lapsus-1100/80">
                              {track.artist.substring(artistMatch, artistMatch + searchQuery.length)}
                            </span>
                            <span>{track.artist.substring(artistMatch + searchQuery.length)}</span>
                          </>
                        ) : (
                          track.artist
                        )}
                      </p>
                    </div>
                    <span className="text-lapsus-400/50 text-xs whitespace-nowrap ml-2">
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
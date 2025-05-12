import { useState } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';

// Importa solo los iconos que necesitas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faPlus, 
  faStar, 
  faShareAlt, 
  faList, 
  faTrash,
  faCopy
} from '@fortawesome/free-solid-svg-icons';

const SongOptionsMenu = ({ song, playlistId }: { song: Song; playlistId: string }) => {
  const { isMenuOpen, setIsMenuOpen, playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlayerStore();
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/song/${song._id}`;
    const shareText = `Mira esta canción: ${song.title} - ${song.artist}`;

    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        // Puedes agregar un toast de confirmación aquí
        break;
      default:
        break;
    }
    
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Botón de tres puntos */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="text-lapsus-500 hover:text-lapsus-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </Button>

      {playlistId && (
        <Button
          onClick={() => removeSongFromPlaylist(playlistId, song._id)}
          className='text-lapsus-500 hover:text-lapsus-300'
        >
          <FontAwesomeIcon icon={faTrash}/>
        </Button>
      )}

      {/* Menú desplegable */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 bottom-2.5 mt-2 w-56 bg-lapsus-1000 rounded-lg shadow-lg z-50 border border-lapsus-900"
          >
            <div className="p-2 space-y-1">
              {/* Opciones principales */}
              {[
                { text: "Darle Me Gusta", icon: faThumbsUp },
                { text: "Agregar a la Cola", icon: faPlus },
                { text: "Darle una Review", icon: faStar },
              ].map((item) => (
                <button
                  key={item.text}
                  className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                >
                  {item.text}
                  <FontAwesomeIcon icon={item.icon} className="text-lapsus-500" />
                </button>
              ))}

              {/* Opción de compartir */}
              <div>
                <button
                  className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  Compartir
                  <FontAwesomeIcon 
                    icon={faShareAlt} 
                    className={`text-lapsus-500 transition-transform ${showShareOptions ? 'rotate-45' : ''}`} 
                  />
                </button>

                {showShareOptions && (
                  <div className="pl-4 space-y-1 mt-1">
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('whatsapp')}
                    >
                      <span className="text-green-500 font-semibold">WhatsApp</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('facebook')}
                    >
                      <span className="text-blue-500 font-semibold">Facebook</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('twitter')}
                    >
                      <span className="text-sky-500 font-semibold">Twitter</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('copy')}
                    >
                      <FontAwesomeIcon icon={faCopy} className="text-lapsus-500" />
                      <span>Copiar enlace</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Opción para añadir a playlist */}
              <button
                className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}
              >
                Añadir a Playlist
                <FontAwesomeIcon icon={faList} className="text-lapsus-500" />
              </button>

              {/* Submenú de playlists */}
              {showPlaylistOptions && (
                <div className="pl-4 space-y-1">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => addSongToPlaylist(playlist.id, song)}
                    >
                      {playlist.name}
                      <FontAwesomeIcon icon={faPlus} className="text-lapsus-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongOptionsMenu;
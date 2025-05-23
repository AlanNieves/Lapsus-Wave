import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faForwardStep,
  faThumbsUp, 
  faPlus, 
  faStar,
  faShareAlt, 
  faList, 

  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faXTwitter,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';

type SongWithShare = Song & {
  shareUrl?: string;
};

const SongOptionsMenu = ({ song}: { song: SongWithShare; playlistId: string }) => {
  const { 
    openMenuSongId, 
    setOpenMenuSongId, 

    addToQueue, 
    addNextSong 
  } = usePlayerStore();
  
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const isMenuOpen = openMenuSongId === song._id;

  const handleShare = (platform: string) => {
    const baseUrl = window.location.origin;
    const shareUrl = song.shareUrl || `${baseUrl}/song/${song._id}`;
    const shareText = `Mira esta canción: ${song.title} - ${song.artist}`;

    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
      default:
        break;
    }
    
    setOpenMenuSongId(null);
  };

  return (
    <div className="relative">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuSongId(isMenuOpen ? null : song._id);
          setShowPlaylistOptions(false);
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
              {[
                { text: "Darle Me Gusta", icon: faThumbsUp },
                { text: "Siguiente cancion", icon: faForwardStep, onClick: () => addNextSong(song) },
                { text: "Agregar a la Cola", icon: faPlus, onClick: () => addToQueue(song) },
                { text: "Darle una Review", icon: faStar },
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => {
                    item.onClick?.();
                    setOpenMenuSongId(null);
                  }}
                  className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-all transform hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  {item.text}
                  <FontAwesomeIcon icon={item.icon} className="text-lapsus-500" />
                </button>
              ))}

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
                      <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 h-5 w-5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('facebook')}
                    >
                      <FontAwesomeIcon icon={faFacebook} className="text-blue-500 h-5 w-5" />
                      <span>Facebook</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                      onClick={() => handleShare('twitter')}
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="text-gray-900 h-5 w-5" />
                      <span>X (Twitter)</span>
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

              <button
                className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-colors"
                onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}
              >
                Añadir a Playlist
                <FontAwesomeIcon icon={faList} className="text-lapsus-500" />
              </button>

           
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongOptionsMenu;
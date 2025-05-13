import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp, faPlus, faStar, faShareAlt, faList, faTrash, faT, faThumbTack } from '@fortawesome/free-solid-svg-icons';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Song } from '@/types';
import { Button } from '@/components/ui/button';


const SongOptionsMenu = ({ song, playlistId }: { song: Song; playlistId: string }) => {
  const { openMenuSongId, setOpenMenuSongId, playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlayerStore();
  const { addToQueue, addNextSong } = usePlayerStore();
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);

  const isMenuOpen = openMenuSongId === song._id;
  return (
    <div className="relative">
      {/* Botón de tres puntos */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          // ⬇️ Si ya está abierto, lo cerramos. Si no, lo abrimos
          setOpenMenuSongId(isMenuOpen ? null : song._id);
          // ⬇️ Siempre cerramos el submenú de playlists cuando clickeas
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


      {/* Menú desplegable */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 bottom-2.5 mt-2 w-48 bg-lapsus-1000 rounded-lg shadow-lg z-50"
          >
            <div className="p-2 space-y-1">
              {/* Opciones principales */}
              {[
                { text: "Darle Me Gusta", icon: faThumbsUp },
                { text: "Siguiente cancion", icon: faForwardStep, onClick: () => addNextSong(song) },
                { text: "Agregar a la Cola", icon: faPlus, onClick: () => addToQueue(song) },
                { text: "Darle una Review", icon: faStar },
                { text: "Compartir", icon: faShareAlt },
              ].map((item, index) => (
                <motion.button
                  key={item.text}
                  onClick={() => {
                    if (item.onClick) item.onClick(); // ✅ Ejecuta la acción si existe
                    setOpenMenuSongId(null); // ✅ Opcional: cerrar el menú después de clickear
                  }}
                  className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-all transform hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.2, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, y: -2, rotateX: 10, translateZ: 10 }}
                >
                  {item.text}
                  <FontAwesomeIcon icon={item.icon} className="text-lapsus-500" />
                </motion.button>
              ))}

              {/* Opción para añadir a playlist */}
              <motion.button
                className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-all transform hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2, rotateX: 10, translateZ: 10 }}
                onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}
              >
                Añadir a Playlist
                <FontAwesomeIcon icon={faList} className="text-lapsus-500" />
              </motion.button>

              {/* Submenú de playlists */}
              {showPlaylistOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 space-y-1"
                >
                  {playlists.map((playlist) => (
                    <motion.button
                      key={playlist.id}
                      className="w-full flex justify-between items-center p-2 text-lapsus-500 hover:bg-lapsus-900 rounded-md transition-all transform hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg"
                      whileHover={{ scale: 1.05, y: -2, rotateX: 10, translateZ: 10 }}
                      onClick={() => addSongToPlaylist(playlist.id, song)}
                    >
                      {playlist.name}
                      <FontAwesomeIcon icon={faPlus} className="text-lapsus-500" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongOptionsMenu;
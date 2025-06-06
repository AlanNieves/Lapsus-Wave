import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useRef } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";
import { useSearchStore } from "@/stores/useSearchStore";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    songs,
    fetchSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const { showSearch, searchTerm, setSearchTerm, setShowSearch } = useSearchStore();
  const hasInitializedQueueRef = useRef(false);

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
    fetchSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchSongs]);

  useEffect(() => {
    if (
      !hasInitializedQueueRef.current &&
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
      hasInitializedQueueRef.current = true;
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

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

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          {showSearch ? (
            <div>
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar canciones..."
                className="w-full mb-6 px-4 py-2 rounded-md text-white 
                  bg-[radial-gradient(circle_at_center,#6A1E55_0%,#2c132b_100%)] 
                  placeholder:text-lapsus-300 focus:outline-none 
                  focus:ring-2 focus:ring-lapsus-500 border-none shadow-sm"
              />

              {filteredSongs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredSongs.map((song) => (
                    <div
                      key={song._id}
                      className="transition cursor-pointer p-4 rounded-lg shadow-md 
                        bg-[radial-gradient(circle_at_center,#6A1E55_0%,#2c132b_100%)] 
                        hover:bg-[#7a2a66]"
                    >
                      <img
                        src={song.imageUrl || "/placeholder.png"}
                        alt={song.title}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                      <div className="text-white font-semibold">{song.title}</div>
                      <div className="text-sm text-lapsus-400">{song.artist}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lapsus-400 text-sm">No se encontraron resultados.</p>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                {t.goodAfternoon || "Good afternoon"}
              </h1>
              <FeaturedSection />
              <div className="space-y-8">
                <SectionGrid
                  title={t.madeForYou || "Made For You"}
                  songs={madeForYouSongs}
                  isLoading={isLoading}
                />
                <SectionGrid
                  title={t.trending || "Trending"}
                  songs={trendingSongs}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;

import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useRef } from "react";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    fetchSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const hasInitializedQueueRef = useRef(false);

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <main className=" rounded-xl scroll-smooth w-full h-full overflow-y-auto scrollbar-none p-10 text-white bg-gradient-to-b from-[#1f1023] via-[#140d1a] to-[#0a0a0a] border border-white/20">
      <Topbar />

      <h1 className="text-4xl font-bold mb-10 drop-shadow-md">
        {t.goodAfternoon || "Good afternoon"}
      </h1>

      {/* Featured Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">🌟 Recomendadas</h2>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
          <FeaturedSection />
        </div>
      </section>

      {/* Made for You */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">🎧 {t.madeForYou || "Made For You"}</h2>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
          <SectionGrid
            title=""
            songs={madeForYouSongs}
            isLoading={isLoading}
            onPlayClick={(song) => console.log("Play song", song)}
          />
        </div>
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">🔥 {t.trending || "Trending"}</h2>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
          <SectionGrid
            title=""
            songs={trendingSongs}
            isLoading={isLoading}
            onPlayClick={(song) => console.log("Play song", song)}
          />
        </div>
      </section>
    </main>
  );
};

export default HomePage;

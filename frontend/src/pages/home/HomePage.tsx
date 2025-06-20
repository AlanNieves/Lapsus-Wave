import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useRef } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/locales";


const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	const { language } = useLanguageStore();
	const t = translations[language];

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	const hasInitializedQueueRef = useRef(false);

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
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>{t.goodAfternoon || "Good afternoon"}</h1>
					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title={t.madeForYou || 'Made For You'} songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title={t.trending || 'Trending'} songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
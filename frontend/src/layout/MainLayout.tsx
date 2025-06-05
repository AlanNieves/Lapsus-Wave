import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import ExpandedPlayerView from "./components/ExpandedPlayerView";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Detectamos si estamos en la ruta de playlist individual
	const isPlaylistView = location.pathname.startsWith("/playlists/");

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				<AudioPlayer />

				{/* left sidebar */}
				<ResizablePanel
					defaultSize={12} // Más delgado por defecto
					minSize={isMobile ? 0 : 15} // Límite mínimo más pequeño
					maxSize={18} // Límite máximo reducido para evitar expansión exagerada
				>
					<LeftSidebar />
				</ResizablePanel>


				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>


			</ResizablePanelGroup>

			<PlaybackControls />
			<ExpandedPlayerView />
		</div>
	);
};

export default MainLayout;

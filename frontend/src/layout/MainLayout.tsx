import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-lapsus-900 text-lapsus-500 flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        <AudioPlayer />
        {/* left sidebar */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-lapsus-900 rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-lapsus-900 rounded-lg transition-colors" />

            {/* right sidebar */}
            <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Reproductor fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient from-lapsus-1200/90 to backdrop-blur-lg border-t border-transparent z-50">
        <PlaybackControls />
      </div>
    </div>
  );
};

export default MainLayout;
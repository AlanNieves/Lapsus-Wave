import { useState } from "react";
import { Laptop2 } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import DeviceSelector from "./DeviceSelector";

interface CastButtonProps {
  mediaUrl: string;
  title?: string;
}

const CastButton: React.FC<CastButtonProps> = ({ mediaUrl, title }) => {
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <>
      <div className="relative group">
        <button 
          onClick={() => setShowDeviceSelector(true)}
          className="p-1 hover:bg-neutral-700 rounded"
          title="Conectar a dispositivo"
        >
          <Laptop2 className="h-5 w-5 text-neutral-300 hover:text-white" />
        </button>
        
        <div className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Conectar a dispositivo
        </div>
      </div>
      
      {showDeviceSelector && (
        <DeviceSelector 
          mediaUrl={mediaUrl} 
          title={title || currentSong?.title || "Canción actual"} 
          onClose={() => setShowDeviceSelector(false)}
        />
      )}
    </>
  );
};

export default CastButton;
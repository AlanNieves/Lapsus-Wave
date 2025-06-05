import { useEffect, useState, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Smartphone, Speaker, Tv, Tablet, Cast, X, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { discoverDevices, playOnDevice, Device } from "@/utils/DeviceDiscover";

interface DeviceSelectorProps {
  mediaUrl: string;
  title: string;
  onClose: () => void;
}

const DeviceSelector = ({ mediaUrl, title, onClose }: DeviceSelectorProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cargar dispositivos al abrir el modal
  useEffect(() => {
    const loadDevices = async () => {
      setIsLoading(true);
      try {
        const discoveredDevices = await discoverDevices();
        setDevices(discoveredDevices);

        // Buscar si ya hay un dispositivo activo
        const activeDevice = discoveredDevices.find(device => device.isActive);
        setSelectedDevice(activeDevice || null);
      } catch (error) {
        toast.error("Error al cargar dispositivos");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  // Cerrar al hacer clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const refreshDevices = async () => {
    setIsRefreshing(true);
    try {
      const discoveredDevices = await discoverDevices();
      setDevices(discoveredDevices);
      toast.success("Dispositivos actualizados");
    } catch (error) {
      toast.error("Error al actualizar dispositivos");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectDevice = async (device: Device) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const success = await playOnDevice(
        device,
        mediaUrl,
        title || currentSong?.title || "Canción actual",
        currentSong?.imageUrl
      );

      if (success) {
        setSelectedDevice(device);
        toast.success(`Reproduciendo en ${device.name}`);

        // Actualizar estado de dispositivos
        setDevices(prev => prev.map(d => ({
          ...d,
          isActive: d.id === device.id
        })));
      } else {
        toast.error(`Error al conectar con ${device.name}`);
      }
    } catch (error) {
      toast.error("Error al conectar con el dispositivo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (!selectedDevice) return;
    
    try {
      // Lógica para desconectar Chromecast
      if (selectedDevice.type === 'chromecast' && window.cast?.framework) {
        const context = window.cast.framework.CastContext.getInstance();
        context.endCurrentSession(true);
      }
      
      toast.info(`Desconectado de ${selectedDevice.name}`);
      setSelectedDevice(null);
      
      // Actualizar estado de dispositivos
      setDevices(prev => prev.map(d => ({
        ...d,
        isActive: false
      })));
    } catch (error) {
      toast.error("Error al desconectar");
      console.error(error);
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case "tv": return <Tv className="w-5 h-5" />;
      case "speaker": return <Speaker className="w-5 h-5" />;
      case "roku": return <Tv className="w-5 h-5 text-orange-500" />;
      case "chromecast": return <Cast className="w-5 h-5 text-blue-500" />;
      case "phone": return <Smartphone className="w-5 h-5" />;
      case "tablet": return <Tablet className="w-5 h-5" />;
      default: return <Cast className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div 
        ref={modalRef}
        className="bg-neutral-900 rounded-xl w-full max-w-md overflow-hidden border border-neutral-800 animate-fade-in"
      >
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Conectar a un dispositivo</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={refreshDevices}
              className="text-neutral-400 hover:text-white"
              disabled={isRefreshing}
              title="Actualizar dispositivos"
            >
              <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              className="text-neutral-400 hover:text-white"
              onClick={onClose}
              title="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-neutral-800 animate-pulse">
                  <div className="bg-neutral-700 rounded-lg w-10 h-10" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-neutral-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Cast className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No se encontraron dispositivos</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Asegúrate de que:
              </p>
              <ul className="text-sm text-neutral-500 text-left mb-4">
                <li>- Tu dispositivo está en la misma red</li>
                <li>- El Chromecast/Roku está encendido</li>
                <li>- No hay firewalls bloqueando la conexión</li>
              </ul>
              <button
                onClick={refreshDevices}
                className="px-4 py-2 bg-lapsus-500 text-lapsus-900 rounded-lg hover:bg-lapsus-400 transition-colors font-medium"
              >
                Volver a intentar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {devices.map(device => (
                <button
                  key={device.id}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                    device.isActive 
                      ? "bg-green-900/30 border border-green-800/50" 
                      : "hover:bg-neutral-800"
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleSelectDevice(device)}
                  disabled={isLoading}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    device.isActive ? "bg-green-900/30 text-green-400" : "bg-neutral-800 text-neutral-400"
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{device.name}</div>
                    <div className={`text-xs truncate ${
                      device.isActive ? "text-green-400" : "text-neutral-500"
                    }`}>
                      {device.type === 'roku' ? 'Roku' : 
                       device.type === 'chromecast' ? 'Chromecast' : 
                       'Dispositivo'}
                      {device.isActive ? ' • Conectado' : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {selectedDevice && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-neutral-800 w-12 h-12 rounded-lg flex items-center justify-center">
                {getDeviceIcon(selectedDevice.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{selectedDevice.name}</div>
                <div className="text-xs text-green-400 truncate">
                  Reproduciendo: {title || currentSong?.title || "Canción actual"}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 px-4 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                onClick={handleDisconnect}
              >
                Desconectar
              </button>
              <button 
                className="flex-1 py-2 px-4 rounded-full bg-lapsus-500 text-lapsus-900 font-medium hover:bg-lapsus-400 transition-colors"
                onClick={() => handleSelectDevice(selectedDevice)}
              >
                Volver a conectar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSelector;
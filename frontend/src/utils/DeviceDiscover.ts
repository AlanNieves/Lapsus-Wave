import { discoverRokuDevices, playOnRoku } from './roku';
import { launchCast } from './cast';

// Tipos de dispositivos compatibles
export type DeviceType =
  | 'chromecast'
  | 'roku'
  | 'dlna'
  | 'airplay'
  | 'tv'
  | 'speaker'
  | 'phone'
  | 'tablet';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip?: string;
  isActive: boolean;
}

/**
 * Descubre todos los dispositivos disponibles en la red
 */
export const discoverDevices = async (): Promise<Device[]> => {
  const devices: Device[] = [];

  // Descubrir dispositivos Roku (solo si no estamos en navegador, o atrapa el error)
  try {
    const rokuDevices = await discoverRokuDevices();
    rokuDevices.forEach((device: { name: string; ip: string }, index) => {
      devices.push({
        id: `roku-${index}-${Date.now()}`,
        name: device.name,
        type: 'roku',
        ip: device.ip,
        isActive: false
      });
    });
  } catch (error) {
    // Si falla, solo muestra un mensaje en consola, no rompas la app
    console.warn("Descubrimiento de Roku no disponible en navegador o error de red:", error);
  }

  // Descubrir dispositivos Chromecast (solo sesión activa)
  if (window.cast?.framework) {
    try {
      const context = window.cast.framework.CastContext.getInstance();
      const session = context.getCurrentSession();

      if (session) {
        devices.push({
          id: session.getSessionId(),
          name: 'Chromecast (Conectado)',
          type: 'chromecast',
          isActive: true
        });
      }
    } catch (castError) {
      console.error("Error obteniendo sesión Chromecast:", castError);
    }
  }

  return devices;
};

/**
 * Reproduce contenido en un dispositivo específico
 */
export const playOnDevice = async (
  device: Device,
  mediaUrl: string,
  title: string,
  imageUrl: string = ""
): Promise<boolean> => {
  try {
    switch (device.type) {
      case 'chromecast':
        await launchCast(mediaUrl, title, imageUrl);
        return true;

      case 'roku':
        if (device.ip) {
          return await playOnRoku(device.ip, mediaUrl, title);
        }
        return false;

      default:
        console.warn(`Tipo de dispositivo no soportado: ${device.type}`);
        return false;
    }
  } catch (error) {
    console.error(`Error al reproducir en ${device.name}:`, error);
    return false;
  }
};
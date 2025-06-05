/**
 * Descubre dispositivos Roku en la red local
 */
export const discoverRokuDevices = async (): Promise<Array<{name: string, ip: string}>> => {
  // No es posible descubrir Roku desde el navegador por CORS y restricciones de red.
  // console.warn("Descubrimiento de Roku no soportado en navegador.");
  return [];
};

/**
 * Reproduce contenido en un dispositivo Roku (versión mejorada)
 */
export const playOnRoku = async (_ip: string, _mediaUrl: string, _title: string = "Lapsus Wave"): Promise<boolean> => {
  // No es posible reproducir en Roku desde el navegador por CORS.
  // console.warn("No es posible reproducir en Roku desde el navegador por CORS.");
  return false;
};

/**
 * Verifica si un dispositivo Roku está disponible
 */
export const checkRokuDevice = async (_ip: string): Promise<boolean> => {
  // No es posible verificar Roku desde el navegador por CORS.
  return false;
};
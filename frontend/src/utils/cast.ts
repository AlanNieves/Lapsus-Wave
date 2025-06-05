declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    cast: any;
  }
}

export const loadCastSdk = () => {
  return new Promise<void>((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.cast && window.cast.framework) {
      initializeCastContext();
      resolve();
      return;
    }

    // Si ya se está cargando
    if (document.getElementById('google-cast-sdk')) {
      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          initializeCastContext();
          resolve();
        } else {
          reject(new Error('Chromecast API no disponible'));
        }
      };
      return;
    }

    // Configurar callback
    window.__onGCastApiAvailable = (isAvailable) => {
      if (isAvailable) {
        initializeCastContext();
        resolve();
      } else {
        reject(new Error('Chromecast API no disponible'));
      }
    };

    // Crear y cargar script
    const script = document.createElement('script');
    script.id = 'google-cast-sdk';
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    script.onerror = () => reject(new Error('Error al cargar Chromecast SDK'));
    document.body.appendChild(script);
  });
};

const initializeCastContext = () => {
  try {
    const context = window.cast.framework.CastContext.getInstance();
    context.setOptions({
      receiverApplicationId: 'CC1AD845', // <-- Cambia aquí
      autoJoinPolicy: 'origin_scoped',
      language: 'es'
    });
  } catch (error) {
    console.error("Error inicializando contexto Chromecast:", error);
  }
};

export const launchCast = async (
  mediaUrl: string, 
  title: string = "Lapsus Wave", 
  imageUrl: string = ""
) => {
  try {
    const context = window.cast.framework.CastContext.getInstance();
    
    if (!context.getCurrentSession()) {
      await context.requestSession();
    }

    const mediaInfo = new window.cast.framework.messages.MediaInfo(
      mediaUrl,
      'audio/mp3'
    );
    
    mediaInfo.metadata = new window.cast.framework.messages.GenericMediaMetadata();
    mediaInfo.metadata.title = title;
    
    if (imageUrl) {
      mediaInfo.metadata.images = [
        new window.cast.framework.messages.Image(imageUrl)
      ];
    }

    const request = new window.cast.framework.messages.LoadRequest(mediaInfo);
    request.autoplay = true;

    const session = context.getCurrentSession();
    await session?.loadMedia(request);
    
  } catch (error) {
    console.error('Error detallado:', error);
    throw error;
  }
};
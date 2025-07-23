/**
 * Representa una canción completa almacenada en la base de datos
 */
export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | { _id: string; title: string } | null;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  artistId: string;
}

/**
 * Representa un álbum con su lista de canciones
 */
export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

/**
 * Estadísticas generales de la plataforma
 */
export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
}

/**
 * Mensaje enviado en el chat
 */
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Usuario del sistema, priorizando lapsus-branch,
 * con campos extendidos para perfil social.
 */
export interface User {
  _id: string;
  email?: string;
  nickname: string;
  phone?: string;
  age?: number;
  avatar: string;            // Imagen de perfil principal
  bio?: string;              // Descripción opcional
  cover?: string;            // Imagen de portada opcional
  tags?: string[];           // Etiquetas opcionales
  followers?: string[];      // IDs de seguidores
  authProvider: "local" | "google" | "facebook" | "apple" | "lapsus-wave";
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  lapsusId?: string;
}

/**
 * Representa un objeto simplificado de canción
 * usado en vistas de listas/reproductor
 */
export interface Track {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  imageUrl?: string;
}

/**
 * Representa una playlist creada por un usuario
 */
export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  createdBy?: string;
  coverImage?: string;
  songs: Song[];
}

/**
 * Representa una reseña de una canción o álbum
 */
export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  songId?: string;
  songTitle?: string;
  artistName?: string;
  albumId?: string;
}

/**
 * Representa un artista y su información
 */
export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  songs?: Song[];
  albums?: Album[];
  followers?: number;
}

/**
 * Datos requeridos en el registro de un usuario
 */
export interface SignupData {
  email?: string;
  phone?: string;
  nickname: string;
  password: string;
  age: string;
  tokenDelivery: "phone" | "email";
}

/**
 * Publicación de un usuario en la red social
 * (si manejas posts tipo feed)
 */
export interface UserPost {
  _id: string;
  image: string;
  description: string;
  createdAt: string;
  userId: {
    _id: string;
    nickname: string;
    avatar?: string; // Alineado a tu modelo, no "image"
  };
}

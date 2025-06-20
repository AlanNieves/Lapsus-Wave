export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  artistId: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Actualizado sin Clerk
export interface User {
  _id: string;
  email: string;
  lapsusId?: string;       // ✅ agregar este
  lastSong?: string; 
  nickname?: string;
  googleId?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  image?: string;        // imagen de perfil personalizada (reemplaza imageUrl)
  cover?: string;        // imagen de portada
  tags?: string[];
  authProvider?: "google" | "lapsus-wave";
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
  followers?: string[];
}

export interface Track {
  _id: string;
  title: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  createdBy?: string;
  coverImage?: string;
  artistId: string;
  songs?: Song[];
}

export interface Post {
  _id: string;
  image: string;
  description: string;
  createdAt: string;
  userId: {
    _id: string;
    nickname: string;
    image?: string;
  };
}

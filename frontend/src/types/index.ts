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
<<<<<<< HEAD
  fullName: string;
  imageUrl: string;
  isVerified: boolean;
=======
  lapsusId?: string;       // ✅ agregar este
  lastSong?: string; 
>>>>>>> 625b92f9a65b6e2ff5782ce07ae7a4b42fdb4fc7
  nickname?: string;
  googleId?: string;
  phone?: string;
<<<<<<< HEAD
  authProvider?: "google" | "local";
=======
  avatar?: string;
  bio?: string;
  image?: string;        // imagen de perfil personalizada (reemplaza imageUrl)
  cover?: string;        // imagen de portada
  tags?: string[];
  authProvider?: "google" | "lapsus-wave";
>>>>>>> 625b92f9a65b6e2ff5782ce07ae7a4b42fdb4fc7
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

<<<<<<< HEAD
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

interface Artist {
  _id: string;
  name: string;
  image?: string;
}


=======
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
>>>>>>> 625b92f9a65b6e2ff5782ce07ae7a4b42fdb4fc7

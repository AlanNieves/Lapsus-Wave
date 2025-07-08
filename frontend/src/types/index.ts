
export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
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
  email?: string; // Opcional, porque puede faltar si el proveedor no es local
  nickname: string;
  phone?: string;
  age?: number;
  avatar: string;
  authProvider: "local" | "google" | "facebook" | "apple" | "lapsus-wave";
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  lapsusId?: string;
}


export interface Track {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  imageUrl?:string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  createdBy?: string;
  coverImage?: string;
  songs: Song[];
}

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

export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  songs?: Song[];
  albums?: Album[];
  followers?:number;
}

export interface SignupData {
  email?: string;
  phone?: string;
  nickname: string;
  password: string;
  age: string;
  tokenDelivery: "phone" | "email";
}

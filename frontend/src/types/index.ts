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
  fullName: string;
  imageUrl: string;
  isVerified: boolean;
  nickname?: string;
  edad?: number;
  phone?: string;
  authProvider?: "google" | "local";
  isProfileComplete?: boolean;
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

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

export interface Message{
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    imageUrl: string;
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
  coverImage?: string; // ✅ Esta línea es la clave
  artistId: string;
  songs?: any[];
}


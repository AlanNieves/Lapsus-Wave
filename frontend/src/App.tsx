// App.tsx
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import CompleteProfilePage from "./pages/completeProfile/CompleteProfilePage";
import AuthPage from "./pages/auth/AuthPage";
import VerifyTokenPage from "./pages/auth/components/VerifyTokenPage";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import PlaylistPage from "./pages/playlist/playlistPage";
import ArtistPage from "./pages/artist/ArtistPage";
import ProfilePage from "./pages/profile/ProfilePage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import ChatPage from "./pages/chat/ChatPage";
import LibraryPage from "./pages/library/LibraryPage";
import LikedSongsPage from "./pages/library/LikedSongsPage";
import SongPage from "./pages/song/SongPage";
import AllPlaylistsPage from "./pages/playlist/AllPlaylistsPage";
import UniversalSearch from "./components/UniversalSearch";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import NotFoundPage from "./pages/404/NotFoundPage";
import RequireCompleteProfile from "./components/requireCompleteProfile";
import AuthProvider from "@/providers/AuthProvider";
import { loadCastSdk } from "@/utils/cast";

function App() {
  useEffect(() => {
    loadCastSdk()
      .then(() => console.log("Chromecast SDK cargado correctamente"))
      .catch((error) => {
        console.log(
          "No se pudo inicializar Chromecast. Esto es normal si no hay soporte para Chromecast."
        );
        console.error("Error al inicializar Chromecast:", error);
      });
  }, []);

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup/verify" element={<VerifyTokenPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Rutas privadas */}
        <Route
          element={
            <AuthProvider>
              <RequireCompleteProfile />
            </AuthProvider>
          }
        >
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="/artist/:artistId" element={<ArtistPage />} />
            <Route path="/playlists" element={<AllPlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/liked-songs" element={<LikedSongsPage />} />
            <Route path="/song/:songId" element={<SongPage />} />
            <Route path="/universal-search" element={<UniversalSearch />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
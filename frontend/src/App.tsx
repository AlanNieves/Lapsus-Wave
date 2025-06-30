import { Route, Routes } from "react-router-dom";
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
import { useEffect } from "react";
import { loadCastSdk } from "@/utils/cast";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import UniversalSearch from "./components/UniversalSearch";
import ReviewsPage from "@/pages/reviews/ReviewsPage"; // Asegúrate de que esta ruta sea correcta
import AllPlaylistsPage from "./pages/playlist/AllPlaylistsPage";
import LoginPage from "./pages/login/LoginPage";
import LibraryPage from "./pages/library/LibraryPage";
import LikedSongsPage from "./pages/library/LikedSongsPage";
import SongPage from "./pages/song/SongPage";

function App() {
    useEffect(() => {
        loadCastSdk()
        .then(() => console.log("Chromecast SDK cargado correctamente"))
        .catch(error => {
            console.log("No se pudo inicializar Chromecast. Esto es normal si no hay soporte para Chromecast.");
            console.error("Error al inicializar Chromecast:", error);
        });
    }, []);

    return (
        <>
            <Routes>
                <Route
                    path='/auth'
                    element={<AuthPage />}
                    
                />
            
                <Route path='/admin' element={<AdminPage />} />

                <Route path="/signup/verify" element={<VerifyTokenPage />} />

                <Route element={<MainLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/albums/:albumId' element={<AlbumPage />} />
                    <Route path="/playlists/:id" element={<PlaylistPage />} />
                    <Route path="/artist/:artistId" element={<ArtistPage />} />
                    <Route path="/playlists" element={<AllPlaylistsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/users/:id" element={<UserProfilePage />} />
                    <Route path="/complete-profile" element={<CompleteProfilePage />} />
                    <Route path="/universal-search" element={<UniversalSearch />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/library/liked-songs" element={<LikedSongsPage />} />
                    <Route path="/song/:songId" element={<SongPage />} />
                    <Route path='*' element={<NotFoundPage />} />
                    
                </Route>
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
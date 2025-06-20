import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";


import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import ArtistPage from "./pages/artist/ArtistPage";
import { useEffect } from "react";
import { loadCastSdk } from "@/utils/cast";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import AllPlaylistsPage from "./pages/playlist/AllPlaylistsPage";
import LoginPage from "./pages/login/LoginPage";
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
                    path='/login'
                    element={<LoginPage />}
                    
                />
            
                <Route path='/admin' element={<AdminPage />} />


				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path="/playlists/:id" element={<PlaylistPage />} />
					<Route path="/artist/:artistId" element={<ArtistPage />} />
                    <Route path="/playlists" element={<AllPlaylistsPage />} />

					<Route path='*' element={<NotFoundPage />} />
					
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import PlaylistPage from "./pages/playlist/PlaylistPage"
import ArtistPage from "./pages/artist/ArtistPage";
import { useEffect } from "react";
import { loadCastSdk } from "@/utils/cast";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import AllPlaylistsPage from "./pages/playlist/AllPlaylistsPage";
import UniversalSearch from "@/components/UniversalSearch";

// Simulación de datos, reemplaza por tus datos reales
const items = [
  { _id: "1", title: "Song One", artist: "Artist A", type: "song" },
  { _id: "2", title: "Album One", artist: "Artist B", type: "album" },
  // ...
];

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
                    path='/sso-callback'
                    element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
                />
                <Route path='/auth-callback' element={<AuthCallbackPage />} />
                <Route path='/admin' element={<AdminPage />} />


				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path="/playlists/:id" element={<PlaylistPage />} />
					<Route path="/artist/:artistId" element={<ArtistPage />} />
                    <Route path="/playlists" element={<AllPlaylistsPage />} />
					<Route
					  path="/universal-search"
					  element={
						<UniversalSearch
						  items={items}
						  onResultSelect={item => {
							// Aquí puedes navegar a la canción o álbum seleccionado
							// Por ejemplo: navigate(`/songs/${item._id}`)
							alert(`Seleccionaste: ${item.title}`);
						  }}
						/>
					  }
					/>

					<Route path='*' element={<NotFoundPage />} />
					
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
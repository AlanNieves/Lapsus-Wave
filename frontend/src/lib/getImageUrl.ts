export const getImageUrl = (path?: string) => {
  if (!path) return "/default-playlist-cover.png";

  if (path.startsWith("http")) return path;

  // Asegúrate de quitar cualquier /api si tu VITE_API_URL contiene /api
  const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");
  return `${BASE_URL}/uploads/${path}`;
};

import {
  Home,
  MessageCircle,
  User,
  Star,
  Library,
  ListMusic,
  Search,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";

// ScrollArea con scrollbar a la izquierda y diseño oscuro
const ScrollArea = ({ children }: { children: React.ReactNode }) => (
  <div
    className="overflow-y-auto h-full w-full scrollbar-thin scrollbar-thumb-[#18181b] scrollbar-track-[#111112] hover:scrollbar-thumb-[#232336] transition-colors duration-200"
    style={{
      scrollbarColor: "#18181b #111112",
      scrollbarWidth: "thin",
      borderRadius: "1rem",
      direction: "rtl", // Invierte el scroll
    }}
  >
    <div style={{ direction: "ltr" }}>{children}</div>
  </div>
);

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Search", icon: Search, path: "/search" },
  { name: "Messages", icon: MessageCircle, path: "/chat" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Reviews", icon: Star, path: "/reviews" },
  { name: "Your Library", icon: Library, path: "/library" },
  { name: "Playlists", icon: ListMusic, path: "/playlists" },
];

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setShowSearch, setSearchTerm } = useSearchStore();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-full h-full relative flex items-center justify-center p-2 bg-gradient-to-b from-[#18181b] to-black backdrop-blur-md">
      {/* Contenedor efecto cristal con scroll */}
      <div className="w-full h-full rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-2 flex flex-col items-center justify-center">
        <ScrollArea>
          <div className="space-y-4 flex flex-col items-center">
            {navItems.map((item) => {
              const active = isActive(item.path);

              // Si es el botón de Search, navega a /universal-search
              if (item.name === "Search") {
                return (
                  <button
                    key={item.name}
                    className="w-full group"
                    onClick={() => navigate("/universal-search")}
                    type="button"
                  >
                    <div
                      className={cn(
                        "relative flex flex-col items-center justify-center w-full h-16 transition-all duration-600 cursor-pointer",
                        "before:content-[''] before:absolute before:inset-1 before:rounded-md before:blur-md before:transition-all before:duration-300",
                        active
                          ? "before:bg-pink-200/20"
                          : "group-hover:before:bg-purple-100/5"
                      )}
                    >
                      <div
                        className={cn(
                          "z-10 flex flex-col items-center justify-center w-full h-full text-white",
                          active && "text-lapsus-500"
                        )}
                      >
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs text-center hidden lg:block">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }

              // Resto de los items igual
              return (
                <Link to={item.path} key={item.name} className="w-full group">
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center w-full h-16 transition-all duration-600 cursor-pointer",
                      "before:content-[''] before:absolute before:inset-1 before:rounded-md before:blur-md before:transition-all before:duration-300",
                      active
                        ? "before:bg-pink-200/20"
                        : "group-hover:before:bg-purple-100/5"
                    )}
                  >
                    <div
                      className={cn(
                        "z-10 flex flex-col items-center justify-center w-full h-full text-white",
                        active && "text-lapsus-500"
                      )}
                    >
                      <item.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs text-center hidden lg:block">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default LeftSidebar;

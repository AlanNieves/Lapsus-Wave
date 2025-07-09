import {
  Home,
  MessageCircle,
  User,
  Star,
  Library,
  ListMusic,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import AnimatedSearchButton from "@/components/navigation/AnimatedSearchButton";

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Messages", icon: MessageCircle, path: "/chat" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Reviews", icon: Star, path: "/reviews", badge: true },
  { name: "Your Library", icon: Library, path: "/library" },
  { name: "Playlists", icon: ListMusic, path: "/playlists" },
];

const LeftSidebar = () => {
  const location = useLocation();
  const { reviews } = useMusicStore();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-full h-full relative flex items-center justify-center p-2 bg-gradient-to-b from-lapsus-1200/35 to-black backdrop-blur-md">
      <div
        className="w-full h-full rounded-2xl bg-black/10 backdrop-blur-md border border-white/10 p-2 flex flex-col items-center justify-center space-y-4"
        style={{ display: "grid" }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              to={item.path}
              key={item.name}
              className="w-full group relative flex items-center justify-center"
            >
              {/* Badge de reviews */}
              {item.badge && reviews.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {reviews.length}
                </span>
              )}

              <div
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-16 transition-all duration-600 cursor-pointer",
                  "before:content-[''] before:absolute before:inset-1 before:rounded-md before:blur-md before:transition-all before:duration-300",
                  active
                    ? "before:bg-pink-200/30"
                    : "group-hover:before:bg-purple-100/10"
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

        {/* Botón de búsqueda animado */}
        <div className="w-full group flex items-center justify-center">
          <div
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-16 transition-all duration-600",
              "before:content-[''] before:absolute before:inset-1 before:rounded-md before:blur-md before:transition-all before:duration-300",
              "group-hover:before:bg-purple-100/10"
            )}
          >
            <AnimatedSearchButton />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;

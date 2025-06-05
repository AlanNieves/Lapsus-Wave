import {
  Home,
  MessageCircle,
  User,
  BarChart,
  Star,
  Library,
  ListMusic,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Messages", icon: MessageCircle, path: "/messages" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Admin Dashboard", icon: BarChart, path: "/admin" },
  { name: "Reviews", icon: Star, path: "/reviews" },
  { name: "Your Library", icon: Library, path: "/library" },
  { name: "Playlists", icon: ListMusic, path: "/playlists" },
];

const LeftSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="w-full h-full relative flex items-center justify-center p-2 bg-gradient-to-b from-[#2b1035] to-black backdrop-blur-md ">
      {/* Contenedor efecto cristal */}
      <div className="w-full h-auto rounded-2xl bg-black/10 backdrop-blur-md border border-white/10 p-2 flex flex-col items-center justify-center space-y-4">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link to={item.path} key={item.name} className="w-full group">
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
      </div>
    </aside>
  );
};

export default LeftSidebar;

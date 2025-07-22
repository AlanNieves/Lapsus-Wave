import { useState, useRef, useEffect } from "react";
import {
  Home,
  MessageCircle,
  User,
  Star,
  Library,
  ListMusic,
  Search as SearchIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";
import { useMusicStore } from "@/stores/useMusicStore";

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

  const AnimatedSearchButton = () => {
    const targetRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const { setShowSearch, setSearchTerm } = useSearchStore();

    const showSearchInput = isHovered || isFocused || inputValue.length > 0;

    useEffect(() => {
      if (showSearchInput && targetRef.current) {
        targetRef.current.focus();
      }
    }, [showSearchInput]);

    useEffect(() => {
      if (!showSearchInput && !targetRef.current?.value) {
        setTimeout(() => setInputValue(""), 200);
      }
    }, [showSearchInput]);

    const handleBlur = () => {
      setIsFocused(false);
      if (!targetRef.current?.value) {
        setIsHovered(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setSearchTerm(value);
      setShowSearch(true);

      if (value.trim() !== "" && location.pathname !== "/universal-search") {
        setTimeout(() => {
          navigate("/universal-search");
        }, 50);
      }
    };

    return (
      <form
        className={cn(
          "relative w-full h-11 md:h-14 flex flex-col items-center justify-center",
          "transition-all duration-500 group"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!targetRef.current?.value) setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "before:content-[''] before:absolute before:inset-1 before:rounded-xl before:blur-lg before:transition-all before:duration-300",
            showSearchInput ? "before:opacity-0" : "group-hover:before:bg-purple-200/5"
          )}
        />

        <div className="z-10 flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center">
            <input
              ref={targetRef}
              type="text"
              placeholder="Buscar..."
              value={inputValue}
              onChange={handleChange}
              className={cn(
                "absolute w-full h-full bg-white/10 backdrop-blur-md",
                "rounded-xl border border-white/20 px-4 pr-10 text-sm",
                "text-white outline-none transition-all duration-500",
                "placeholder:text-white/50",
                showSearchInput
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50 pointer-events-none"
              )}
            />

            {showSearchInput ? (
              <div className="absolute right-3 z-20 flex items-center justify-center text-purple-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            ) : (
              <button
                type="button"
                className="z-20 flex items-center justify-center w-5 h-5 text-white"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <span
            className={cn(
              "text-[11px] text-center hidden lg:block font-medium mt-0.5",
              "transition-opacity duration-300",
              showSearchInput ? "opacity-0" : "opacity-100"
            )}
          >
            Search
          </span>
        </div>
      </form>
    );
  };

  return (
    <aside className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-[#1f102a]/50 to-[#0d0913]/90">
      <div className="w-full h-full rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-2 flex flex-col items-center justify-center shadow-xl">
        <nav className="flex flex-col items-center w-full h-full justify-center gap-4 py-6">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                to={item.path}
                key={item.name}
                className="w-full group flex items-center justify-center relative"
              >
                {item.badge && reviews.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {reviews.length}
                  </span>
                )}
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center w-full h-11 md:h-14 transition-all duration-600 cursor-pointer",
                    "before:content-[''] before:absolute before:inset-1 before:rounded-xl before:blur-md before:transition-all before:duration-300",
                    active
                      ? "before:bg-purple-300/10"
                      : "group-hover:before:bg-purple-200/5"
                  )}
                >
                  <div
                    className={cn(
                      "z-10 flex flex-col items-center justify-center w-full h-full",
                      active ? "text-purple-300" : "text-white"
                    )}
                  >
                    {/* ✅ Ícono animado */}
                    <item.icon
                      className={cn(
                        "w-4 h-4 mb-0.5 transition-transform duration-300",
                        "group-hover:scale-110 group-hover:animate-pulse"
                      )}
                    />
                    <span className="text-[11px] text-center hidden lg:block font-medium">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="w-full group flex items-center justify-center">
            <div
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-11 md:h-14 transition-all duration-600",
                "before:content-[''] before:absolute before:inset-1 before:rounded-xl before:blur-md before:transition-all before:duration-300",
                "group-hover:before:bg-purple-200/5"
              )}
            >
              <AnimatedSearchButton />
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;

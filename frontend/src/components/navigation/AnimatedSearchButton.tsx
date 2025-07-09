import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";

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
        "relative w-full h-11 flex items-center justify-center group"
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
      <div className="absolute inset-0 flex items-center justify-center">
        <input
          ref={targetRef}
          type="text"
          placeholder="Buscar..."
          aria-label="Buscar"
          value={inputValue}
          onChange={handleChange}
          className={cn(
            "absolute w-full h-full bg-black/30 backdrop-blur-md",
            "rounded-full border border-lapsus-500 px-4 pr-10",
            "text-white outline-none transition-all duration-500",
            "placeholder:text-white/50",
            showSearchInput
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 pointer-events-none"
          )}
        />
        {showSearchInput ? (
          <div className="absolute right-3 z-20 text-lapsus-500">
            <SearchIcon className="w-5 h-5" />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Abrir búsqueda"
            className="z-20 flex items-center justify-center w-5 h-5 text-white"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default AnimatedSearchButton;

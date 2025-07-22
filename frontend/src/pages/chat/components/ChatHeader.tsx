import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();
  const navigate = useNavigate();

  if (!selectedUser) return null;

  const userInitial = selectedUser?.nickname?.[0] ?? "U";

  const goToProfile = () => {
    navigate(`/users/${selectedUser._id}`);
  };

  return (
    <div className="px-6 py-4 border-b border-white/5">
      <div
        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow transition-all cursor-pointer"
        onClick={goToProfile}
        title="Ver perfil"
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src={selectedUser.image || "/default-avatar.png"} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-white text-lg font-semibold">{selectedUser.nickname ?? "Usuario"}</h2>
          <p className={`text-sm ${onlineUsers.has(selectedUser._id) ? "text-green-400" : "text-purple-400"}`}>
            {onlineUsers.has(selectedUser._id) ? "🟢 En línea" : "🔘 Desconectado"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

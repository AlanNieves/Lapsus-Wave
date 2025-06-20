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
    <div className='p-4 border-b border-transparent'>
      <div
        className='flex items-center gap-3 cursor-pointer hover:bg-lapsus-1250 rounded-lg p-2 transition-all'
        onClick={goToProfile}
        title="Ver perfil"
      >
        <Avatar>
          <AvatarImage src={selectedUser.image || "/default-avatar.png"} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className='font-medium text-white'>{selectedUser.nickname ?? "Usuario"}</h2>
          <p className='text-sm text-lapsus-700'>
            {onlineUsers.has(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

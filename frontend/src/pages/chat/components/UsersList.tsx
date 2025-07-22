import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";

const UsersList = () => {
  const {
    users = [],
    selectedUser,
    isLoading,
    setSelectedUser,
    onlineUsers,
    chatOrder,
  } = useChatStore();

  const navigate = useNavigate();

  const sortedUsers = useMemo(() => {
    const chatOrderSet = new Set(chatOrder);
    const orderedUsers = chatOrder
      .map((id) => users.find((u) => u._id === id))
      .filter((u): u is User => Boolean(u));
    const remainingUsers = users.filter((u) => !chatOrderSet.has(u._id));
    return [...orderedUsers, ...remainingUsers];
  }, [chatOrder, users]);

  return (
    <div className="h-full p-2 flex flex-col">
      <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl overflow-hidden">
        <ScrollArea className="h-full px-2 py-4">
          {isLoading ? (
            <UsersListSkeleton />
          ) : (
            <div className="space-y-2">
              {sortedUsers.map((user) => {
                const isSelected = selectedUser?._id === user._id;

                return (
                  <div
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      navigate(`/chat/${user._id}`);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "bg-gradient-to-r from-[#661766]/60 to-[#3e1544]/50 border border-[#913f8f]/30 shadow-[0_0_12px_#913f8f33]"
                      : "hover:bg-white/5 hover:shadow-md"}`}
                  >
                    <div className="relative">
                      <Avatar className="size-10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>
                          {user.nickname?.[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-[#1f102a]
                        ${onlineUsers.has(user._id) ? "bg-green-500" : "bg-neutral-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-white">
                        {user.nickname ?? "Usuario"}
                      </p>
                      <p className="text-xs text-lapsus-700">
                        {onlineUsers.has(user._id) ? "En línea" : "Desconectado"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;

import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useMemo, useRef } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import type { Message } from "@/types";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const user = useAuthStore((state) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  const uniqueMessages: Message[] = useMemo(() => {
    if (!selectedUser || !user) return [];
    const rawMessages = messages[selectedUser._id] || [];
    const map = new Map<string, Message>();
    for (const m of rawMessages) {
      if (m && m._id) map.set(m._id, m);
    }
    return Array.from(map.values());
  }, [messages, selectedUser, user]);

  if (!user) return null;

  return (
    <main className="rounded-xl h-[calc(100vh-90px)] overflow-hidden border border-white/20">
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-full">
        <UsersList />

        <div className="flex flex-col h-full p-2">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl overflow-hidden flex flex-col">
            {selectedUser ? (
              <>
                <ChatHeader />
                <ScrollArea className="flex-1 overflow-auto px-2">
                  <div className="p-4 space-y-4">
                    {uniqueMessages.map((message) => {
                      const isOwnMessage = message.senderId === user._id;
                      return (
                        <div
                          key={message._id}
                          className={`flex gap-3 ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isOwnMessage && (
                            <Avatar className="size-8 ring-1 ring-lapsus-800">
                              <AvatarImage src={selectedUser.image} />
                            </Avatar>
                          )}

                          <div className="max-w-[70%] space-y-1">
                            <div
                              className={`px-4 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 ${
                                isOwnMessage
                                  ? "bg-[#913f8f]/70 text-white rounded-br-none"
                                  : "bg-[#1f102a]/70 text-lapsus-100 rounded-bl-none"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <span
                              className={`text-xs ${
                                isOwnMessage ? "text-right" : "text-left"
                              } text-lapsus-500 block`}
                            >
                              {formatTime(message.createdAt)}
                            </span>
                          </div>

                          {isOwnMessage && (
                            <Avatar className="size-8 ring-1 ring-lapsus-800">
                              <AvatarImage src={user.imageUrl} />
                            </Avatar>
                          )}
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>
                <div className="px-4 pb-4">
                  <MessageInput />
                </div>
              </>
            ) : (
              <NoConversationPlaceholder />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
    <img src="/vite.svg" alt="Lapsus" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-lapsus-500 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-lapsus-800 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);

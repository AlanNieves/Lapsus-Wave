import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import type { Message } from "@/types";

const ChatMessages = () => {
  const { user } = useAuthStore();
  const { selectedUser, messages, fetchMessages } = useChatStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const chatId = selectedUser?._id ?? "";
  const allMessages: Message[] = messages[chatId] || [];

  useEffect(() => {
    if (chatId) fetchMessages(chatId);
  }, [chatId, fetchMessages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [allMessages]);

  if (!selectedUser || !user) {
    return (
      <div className="flex-1 text-purple-200 flex items-center justify-center px-4 text-center">
        Selecciona un usuario para comenzar a chatear.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden" ref={containerRef}>
      <ScrollArea className="h-full px-4 py-6">
        <div className="flex flex-col gap-4">
          {allMessages.map((msg) => {
            const isMine = msg.senderId?.toString?.() === user._id;

            return (
              <div
                key={msg._id || `${msg.senderId}-${msg.content}-${Math.random()}`}
                className={`max-w-[70%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap break-words shadow-lg border
                  ${isMine
                    ? "self-end bg-gradient-to-br from-purple-600/40 to-pink-500/30 text-white border-white/10"
                    : "self-start bg-white/5 text-purple-100 border-white/10"
                  }`}
              >
                {msg.content}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;

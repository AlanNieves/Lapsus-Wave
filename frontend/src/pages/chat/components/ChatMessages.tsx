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
      <div className="flex-1 text-white flex items-center justify-center">
        Selecciona un usuario para comenzar a chatear
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2" ref={containerRef}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2">
          {allMessages.map((msg) => {
            const isMine = msg.senderId?.toString?.() === user._id;

            return (
              <div
                key={msg._id || `${msg.senderId}-${msg.content}-${Math.random()}`}

                className={`max-w-[70%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap break-words
                  ${isMine ? "bg-pink-800 text-white self-end" : "bg-zinc-800 text-white self-start"}`}
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

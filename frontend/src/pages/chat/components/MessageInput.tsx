import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const { selectedUser, sendMessage } = useChatStore();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || !selectedUser) return;

    sendMessage(selectedUser._id, content);
    setContent("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full border border-white/10 rounded-xl mx-2 mb-2 bg-white/5 backdrop-blur-md shadow-xl px-4 py-3 flex items-center gap-3"
    >
      <Input
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-lapsus-700 focus:outline-none focus:ring-1 focus:ring-lapsus-500 transition"
      />

      <button
        type="submit"
        className="p-2 rounded-full bg-gradient-to-br from-purple-600/60 to-pink-500/60 hover:from-purple-700 hover:to-pink-600 transition shadow-md border border-white/10"
        aria-label="Send message"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </form>
  );
};

export default MessageInput;

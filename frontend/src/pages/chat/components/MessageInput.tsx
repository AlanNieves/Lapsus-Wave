import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { Send } from "lucide-react";
import { useState } from "react";
import { User } from "@/stores/useAuthStore";

interface Props {
	user: User;
}

const MessageInput = ({ user }: Props) => {
	const [content, setContent] = useState("");
	const { selectedUser, sendMessage } = useChatStore();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim() || !selectedUser) return;

		// ✅ Corregido: pasar 3 argumentos
		sendMessage(selectedUser._id, content, user._id);

		setContent("");
	};

	return (
		<form
			onSubmit={onSubmit}
			className='flex items-center gap-2 border-t border-lapsus-800 p-4'
		>
			<Input
				placeholder='Type your message...'
				value={content}
				onChange={(e) => setContent(e.target.value)}
				className='bg-lapsus-1100 border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
			/>

			<button
				type='submit'
				className='p-2 rounded-full bg-lapsus-1000 hover:bg-lapsus-950 transition'
			>
				<Send className='w-4 h-4 text-white' />
			</button>
		</form>
	);
};

export default MessageInput;
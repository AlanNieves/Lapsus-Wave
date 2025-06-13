import Topbar from "@/components/Topbar";
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

	// ✅ Agrupamos mensajes únicos por _id para evitar duplicados
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
		<main className='h-full rounded-lg bg-gradient-to-b from-lapsus-1200/35 to-lapsus-900 overflow-hidden'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />

				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4'>
									{uniqueMessages.map((message) => (
										<div
											key={message._id}
											className={`flex items-start gap-3 ${
												message.senderId === user._id ? "flex-row-reverse" : ""
											}`}
										>
											<Avatar className='size-8'>
												<AvatarImage
													src={
														message.senderId === user._id
															? user.imageUrl
															: selectedUser.imageUrl
													}
												/>
											</Avatar>

											<div
												className={`rounded-lg p-3 max-w-[70%]
													${
														message.senderId === user._id
															? "bg-lapsus-1000"
															: "bg-lapsus-1100/20"
													}
												`}
											>
												<p className='text-sm'>{message.content}</p>
												<span className='text-xs text-lapsus-500 mt-1 block'>
													{formatTime(message.createdAt)}
												</span>
											</div>
										</div>
									))}

									<div ref={bottomRef} />
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};

export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img src='/vite.svg' alt='Lapsus' className='size-16 animate-bounce' />
		<div className='text-center'>
			<h3 className='text-lapsus-500 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-lapsus-800 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);

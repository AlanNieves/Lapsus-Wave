import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-transparent'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.nickname}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.nickname}</h2>
					<p className='text-sm text-lapsus-700'>
						{onlineUsers.has(selectedUser._id) ? "Online" : "Offline"}
					</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	/*const isOnline = onlineUsers?.has?.(selectedUser._id);*/
	const userInitial = selectedUser?.fullName?.[0] ?? "U";

	return (
		<div className='p-4 border-b border-transparent'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{userInitial}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.nickname ?? "Usuario"}</h2>
					<p className='text-sm text-lapsus-700'>
						{onlineUsers.has(selectedUser._id) ? "Online" : "Offline"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;

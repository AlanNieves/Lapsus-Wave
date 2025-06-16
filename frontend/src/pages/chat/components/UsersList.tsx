import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useMemo } from "react";
import type { User } from "@/types";

const UsersList = () => {
	const {
		users,
		selectedUser,
		isLoading,
		setSelectedUser,
		onlineUsers,
		chatOrder,
	} = useChatStore();

	const sortedUsers = useMemo(() => {
		const chatOrderSet = new Set(chatOrder);
		const orderedUsers = chatOrder
			.map((id) => users.find((u) => u._id === id))
			.filter((u): u is User => Boolean(u));

		const remainingUsers = users.filter((u) => !chatOrderSet.has(u._id));
		return [...orderedUsers, ...remainingUsers];
	}, [chatOrder, users]);

	return (
		<div className='border-r border-transparent'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							sortedUsers.map((user) => (
								<div
									key={user._id}
									onClick={() => setSelectedUser(user)}
									className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                    rounded-lg cursor-pointer transition-colors
                    ${
											selectedUser?._id === user._id
												? "bg-lapsus-1000"
												: "hover:bg-lapsus-1000"
										}`}
								>
									<div className='relative'>
										<Avatar className='size-8 md:size-12'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-neutral-800
													${
													onlineUsers.has(user._id)
														? "bg-green-500"
														: "bg-neutral-500"
											}`}
										/>
									</div>

									<div className='flex-1 min-w-0 lg:block hidden'>
										<span className='truncate max-w-[180px] block'>
											{user.fullName}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;

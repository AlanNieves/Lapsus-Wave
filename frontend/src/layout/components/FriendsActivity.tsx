import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
	const { user } = useUser();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	return (
		<div className='h-full bg-gradient-to-b from-lapsus-1200/30 to-lapsus-900 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-lapsus-00'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>What they're listening to</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{users.map((user) => {
						const activity = userActivities.get(user.clerkId);
						const isPlaying = activity && activity !== "Idle";

						return (
							<div
								key={user._id}
								className='cursor-pointer hover:bg-lapsus-1000 p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3'>
									<div className='relative'>
										<Avatar className='size-10 border border-transparent'>
											<AvatarImage src={user.imageUrl} alt={user.fullName} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-lapsus-900 
												${onlineUsers.has(user.clerkId) ? "bg-lapsus-1200" : "bg-lapsus-1100"}
												`}
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='font-medium text-sm text-lapsus-500'>{user.fullName}</span>
											{isPlaying && <Music className='size-3.5 text-lapsus-1200 shrink-0' />}
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-lapsus-500 font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-lapsus-800 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className='mt-1 text-xs text-lapsus-800'>Idle</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};
export default FriendsActivity;

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-b from-lapsus-1100/40 to-lapsus-1100 rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-gradient-to  rounded-full p-4'>
				<HeadphonesIcon className='size-8 text-lapsus-500' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-lapsus-500'>See What Friends Are Playing</h3>
			<p className='text-sm text-lapsus-800'>Login to discover what music your friends are enjoying right now</p>
		</div>
	</div>
);
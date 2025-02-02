const QueueSkeleton = () => {
	return(
		<div className="space-y-2">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="felx items-center gap-3 p-2">
					<div className="h-12 w-12 rounded-md"/>
					<div className="flex-1 space-y-1">
						<div className="h-4 w-[70%]"/>
						<div className="h-3 w-[50%]"></div>
					</div>
					<div className="h-4 w-4 rounded-full"/>
				</div>
			))}
		</div>
	)
}

export default QueueSkeleton;
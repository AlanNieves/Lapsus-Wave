import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;

	onlineUsers: Set<string>;
	userActivities: Map<string, string>;

	messages: Record<string, Message[]>; // userId => mensajes
	chatOrder: string[]; // userIds en orden por actividad
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
	autoConnect: false,
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: {},
	chatOrder: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Error fetching users" });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const updated = new Set(state.onlineUsers);
					updated.delete(userId);
					return { onlineUsers: updated };
				});
			});

			socket.on("receive_message", (message: Message) => {
				const currentUserId = useAuthStore.getState().user?._id;

				// Verifica si ya existe ese mensaje en el estado (por _id)
				const alreadyExists = get().messages[message.senderId]?.some(
				(m) => m._id === message._id
				);

				// Si fue enviado por ti o ya existe, ignóralo
				if (message.senderId === currentUserId || alreadyExists) return;


				addMessage(message);
			});

			socket.on("message_sent", (message: Message) => {
				// ✅ Recibe confirmación de tus propios mensajes
				addMessage(message);
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, content) => {
		const socket = get().socket;
		const { user } = useAuthStore.getState();
		const senderId = user?._id;

		if (!socket || !senderId) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set((state) => ({
				messages: {
					...state.messages,
					[userId]: response.data,
				},
			}));
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Error loading messages" });
		} finally {
			set({ isLoading: false });
		}
	},
}));

// 🔁 Manejo centralizado de almacenamiento y orden de mensajes
function addMessage(message: Message) {
	const { senderId, receiverId } = message;
	const currentUserId = useAuthStore.getState().user?._id;
	const isSender = senderId === currentUserId;
	const targetId = isSender ? receiverId : senderId;

	useChatStore.setState((state) => {
		const prev = state.messages[targetId] || [];
		return {
			messages: {
				...state.messages,
				[targetId]: [...prev, message],
			},
			chatOrder: [targetId, ...state.chatOrder.filter((id) => id !== targetId)],
		};
	});
}

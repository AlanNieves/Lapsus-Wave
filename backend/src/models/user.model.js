import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},

		playlists: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Playlist"
		}],

		collaborators: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
	},
	{ timestamps: true } //  createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);
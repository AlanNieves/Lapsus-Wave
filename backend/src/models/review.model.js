import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number,       
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  songId: { 
    type: String, 
    required: true 
  },
  songTitle: { 
    type: String, 
    required: true 
  },
  artistName: { 
    type: String, 
    required: true 
  },
  albumId: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Review = mongoose.model("Review", reviewSchema);

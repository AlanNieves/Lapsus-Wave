import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: 6,
    },
    googleId: String,
    facebookId: String,
    appleId: String,
    avatar: String,
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.authProvider === "local") {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
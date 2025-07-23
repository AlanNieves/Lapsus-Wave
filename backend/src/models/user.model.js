import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

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
      sparse: true, // Permite que usuarios de Google no tengan email único si ya existe
    },
    nickname: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    age: {
      type: Number,
      min: 13,
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
    lapsusId: String,

    /**
     * Imagen de perfil principal
     */
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random",
    },

    /**
     * Imagen de portada opcional
     */
    cover: {
      type: String,
      default: "",
    },

    /**
     * Breve biografía del usuario
     */
    bio: {
      type: String,
      default: "",
    },

    /**
     * Etiquetas asociadas al usuario
     */
    tags: {
      type: [String],
      default: [],
    },

    /**
     * IDs de otros usuarios que siguen a este usuario
     */
    followers: {
      type: [String],
      default: [],
    },

    /**
     * Canciones marcadas como favoritas por el usuario
     */

    likedSongs:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],

    /**
     * Albumes guardados por el usuario
     */
    savedAlbums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple", "lapsus-wave"],
      required: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },


  },
  {
    timestamps: true,
  }
);

// Hash de contraseña antes de guardar (solo si es 'local')
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
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
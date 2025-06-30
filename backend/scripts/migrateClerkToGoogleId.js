import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js"; // Ajusta la ruta según tu proyecto

dotenv.config();

// 📌 Mapa manual de email → googleId
const emailToGoogleId = {
  "peralta.tec02@gmail.com": "google-oauth2|123456789012345678901",
  
  
};

const migrateByEmail = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    const users = await User.find({ clerkId: { $exists: true } });

    for (const user of users) {
      const email = user.email;

      if (!email) {
        console.log(`⚠️ Usuario sin email: ${user._id}`);
        continue;
      }

      const googleId = emailToGoogleId[email];

      if (!googleId) {
        console.log(`⚠️ No se encontró googleId para ${email}`);
        continue;
      }

      user.googleId = googleId;
      user.clerkId = undefined;
      await user.save();

      console.log(`✅ Migrado: ${email}`);
    }

    console.log("🎉 Migración completada");
  } catch (err) {
    console.error("❌ Error en migración:", err);
  } finally {
    await mongoose.disconnect();
  }
};

migrateByEmail();

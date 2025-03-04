import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Only for email-password sign-up
  provider: String, // "google" or "github"
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

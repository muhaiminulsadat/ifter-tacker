import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {type: Boolean, default: false},
    image: {type: String, default: ""},

    // Custom fields
    role: {type: String, enum: ["admin", "member"], default: "member"},
    room: {type: String, trim: true, default: ""},
    avatar: {type: String, default: ""}, // auto-generated initials e.g "RA"
  },
  {
    timestamps: true,
    collection: "user", // MUST match Better Auth's collection name
  },
);

// Auto-generate avatar initials from name
UserSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    const parts = this.name.trim().split(" ");
    this.avatar =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
  }

});

const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;

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

    isApproved: {type: Boolean, default: false},
    role: {type: String, enum: ["admin", "member"], default: "member"},
    room: {type: String, trim: true, default: ""},
    avatar: {type: String, default: ""}, // auto-generated initials e.g "RA"
  },
  {
    timestamps: true,
    collection: "user", // MUST match Better Auth's collection name
  },
);

UserSchema.pre("save", function (next) {
  if (this.role === "admin") this.isApproved = true;

  if (this.isModified("name") || this.isNew) {
    const parts = this.name.trim().split(" ");
    this.avatar =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
  }

  if (this.isNew) {
    this.image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${this._id}`;
  }
});

const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;

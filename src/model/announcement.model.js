import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);


AnnouncementSchema.index({pinned: -1, createdAt: -1});

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;

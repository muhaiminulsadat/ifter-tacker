import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    ramadanDay: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    status: {
      type: String,
      enum: ["attending", "absent"],
      default: "attending",
      required: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
  },
  {timestamps: true},
);

// One record per user per day — upsert on update
AttendanceSchema.index({userId: 1, ramadanDay: 1}, {unique: true});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;

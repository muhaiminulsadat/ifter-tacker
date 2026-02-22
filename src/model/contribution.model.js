import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "user",
      required: true,
      index:    true,
    },
    amount: {
      type:     Number,
      required: true,
      min:      [1, "Amount must be at least 1 taka"],
    },
    ramadanDay: {
      type:     Number,
      required: true,
      min:      1,
      max:      30,
    },
    note: {
      type:      String,
      default:   "",
      trim:      true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

// Quickly sum contributions per user per day
ContributionSchema.index({ userId: 1, ramadanDay: 1 });

const Contribution =
  mongoose.models.Contribution ||
  mongoose.model("Contribution", ContributionSchema);

export default Contribution;
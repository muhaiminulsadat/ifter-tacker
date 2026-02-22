import {EXPENSE_CATEGORIES} from "@/utils/constants";
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, trim: true, maxlength: 100},
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1 taka"],
    },
    category: {type: String, enum: EXPENSE_CATEGORIES, required: true},
    paidByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    ramadanDay: {type: Number, required: true, min: 1, max: 30},
    attendeeCount: {type: Number, required: true, min: 1},
    perHead: {type: Number, default: 0},
    note: {type: String, default: "", trim: true, maxlength: 300},
  },
  {timestamps: true},
);

// Auto-calculate perHead before save
ExpenseSchema.pre("save", async function () {
  if (this.attendeeCount > 0) {
    this.perHead = Math.round(this.amount / this.attendeeCount);
  }
});

ExpenseSchema.index({ramadanDay: 1});
ExpenseSchema.index({paidByUserId: 1});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;

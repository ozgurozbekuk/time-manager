import mongoose from "mongoose";

const trackerSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  projectName: { type: String, required: true, trim: true },
  taskName: { type: String, required: true, trim: true },
  start: { type: Date, required: true, default: () => new Date() },
  end: { type: Date },
  durationSec: { type: Number, min: 0 },
  isRunning: { type: Boolean, default: true, index: true },
  source: { type: String, enum: ["timer", "manual"], default: "timer" },
},{timestamps:true})

trackerSchema.pre("save", function (next) {
  if (this.end) {
    const diffMs = this.end - this.start; // milisaniye farkı
    const diffSec = Math.floor(diffMs / 1000); // saniye
    this.durationSec = Math.max(0, diffSec);   // negatif olursa 0 yap
    this.isRunning = false;                    // bitmiş oluyor
  }
  next();
});

const Tracker = mongoose.model("Tracker",trackerSchema)

export default Tracker
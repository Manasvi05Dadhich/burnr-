const mongoose = require("mongoose");
const ToolInputSchema = require('./toolsinput');



const AuditSchema = new mongoose.Schema(
  {
    // Public share URL uses this — separate from _id for security
    shareSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Form inputs
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: [1, "Team size must be at least 1"],
    },

    useCase: {
      type: String,
      required: [true, "Use case is required"],
      enum: {
        values: ["coding", "writing", "research", "customer_support", "data", "mixed"],
        message: "{VALUE} is not a valid use case",
      },
    },

    // Raw form data — stored so you can re-run engine on old audits if logic changes
    toolsInput: {
      type: [ToolInputSchema],
      required: true,
      validate: {
        validator: (v) => v.length >= 1,
        message: "At least one tool must be entered",
      },
    },

    // Engine output — one per tool
    recommendations: {
      type: [RecommendationSchema],
      required: true,
    },

   
    totalMonthlySavings: {
      type: Number,
      required: true,
      default: 0,
    },

    totalAnnualSavings: {
      type: Number,
      required: true,
      default: 0,
    },

    aiSummary: {
      type: String,
      trim: true,
      default: "",
    },

    
    summaryFallback: {
      type: Boolean,
      default: false,
    },
    spendMismatchFlagged: {
      type: Boolean,
      default: false,
    },

    leadCaptured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

AuditSchema.index({ shareSlug: 1 });         // fast share page lookups
AuditSchema.index({ createdAt: -1 });        // latest audits first for admin



AuditSchema.virtual("hasSavings").get(function () {
  return this.totalMonthlySavings > 0;
});



module.exports = mongoose.model("Audit", AuditSchema);
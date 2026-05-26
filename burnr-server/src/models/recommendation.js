const mongoose = require('mongoose');
const RecommendationSchema = new mongoose.Schema(
    {
      toolName: {
        type: String,
        required: true,
        trim: true,
      },
      currentPlan: {
        type: String,
        required: true,
        trim: true,
      },
      currentSpend: {
        type: Number,
        required: true,
      },
  
      scores: {
        priceFit: { type: Number, min: 0, max: 25, required: true },
        planFit: { type: Number, min: 0, max: 25, required: true },
        useCaseFit: { type: Number, min: 0, max: 25, required: true },
        overlap: { type: Number, min: 0, max: 25, required: true },
        total: { type: Number, min: 0, max: 100, required: true },
      },
  
      action: {
        type: String,
        required: true,
        enum: ["switch_tool", "switch_plan", "downgrade", "keep", "drop"],
      },
  
      recommendedTool: { type: String, trim: true, default: null },
      recommendedPlan: { type: String, trim: true, default: null },
      projectedSpend: { type: Number, default: null },
      monthlySavings: { type: Number, default: 0 },
      annualSavings: { type: Number, default: 0 },
  
      // Human-readable explanation — finance-defensible
      reason: {
        type: String,
        required: true,
        trim: true,
      },
  
      // How confident the engine is in this recommendation
      confidence: {
        type: String,
        required: true,
        enum: ["high", "medium", "low"],
      },
  
      // Whether this tool overlaps with another in the stack
      hasOverlap: { type: Boolean, default: false },
      overlapsWith: { type: String, default: null },
    },
    { _id: false }
  );
  mongoose.model('Recommendation', RecommendationSchema);
  module.exports = mongoose.model('Recommendation', RecommendationSchema);
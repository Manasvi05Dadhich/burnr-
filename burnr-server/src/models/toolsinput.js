const mongoose = require('mongoose');
const ToolInputSchema = new mongoose.Schema(
    {
      toolName: {
        type: String,
        required: [true, "Tool name is required"],
        trim: true,
        enum: {
          values: [
            "ChatGPT",
            "Claude",
            "Cursor",
            "GitHub Copilot",
            "Gemini",
            "OpenAI API",
            "Anthropic API",
            "Windsurf",
          ],
          message: "{value} is not a supported tool",
        },
      },
      planName: {
        type: String,
        required: [true, "Plan name is required"],
        trim: true,
      },
      seats: {
        type: Number,
        required: [true, "Number of seats is required"],
        min: [1, "Seats must be at least 1"],
      },
      monthlySpend: {
        type: Number,
        required: [true, "Monthly spend is required"],
        min: [0, "Monthly spend cannot be negative"],
      },
    },
    { _id: false } 
  );
  mongoose.model('ToolInput', ToolInputSchema);
  module.exports = mongoose.model('ToolInput');
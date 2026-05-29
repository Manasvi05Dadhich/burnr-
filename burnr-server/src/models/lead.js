const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {

    auditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audit",
      required: [true, "Audit ID is required"],
    },

  
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true, 
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },

    company: {
      type: String,
      trim: true,
      default: null,
    },

    role: {
      type: String,
      trim: true,
      default: null,
      
    },

   
    emailSent: {
      type: Boolean,
      default: false,
    },

    
    emailSentAt: {
      type: Date,
      default: null,
    },

    emailError: {
      type: String,
      default: null,
    },

    contacted: {
      type: Boolean,
      default: false,
    },

    
    savingsAtCapture: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);



LeadSchema.index({ email: 1 });              
LeadSchema.index({ auditId: 1 });           
LeadSchema.index({ createdAt: -1 });        
LeadSchema.index({ emailSent: 1 });         



LeadSchema.index({ auditId: 1, email: 1 }, { unique: true });


module.exports = mongoose.model("Lead", LeadSchema);
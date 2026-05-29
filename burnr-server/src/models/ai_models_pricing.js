const mongoose = require('mongoose');

const AiModelPriceSchema = new mongoose.Schema({
   toolName : {
    type : String , 
    required : [true , "Tool name is required"],
    trim  :true ,
    enum : [
        "ChatGPT",
        "Claude",
        "Cursor",
        "GitHub Copilot",
        "Gemini",
        "OpenAI API",
        "Anthropic API",
        "Windsurf",
    ]
   }, 
   planName : {
    type : String ,
    trim : true , 
    required :[ true , "Plan Name is required"]
   },
   pricePerSeat :{
    type : Number  , default : null , 
    min  : [0, "Price cant be negative"]
   },


   flatPrice : {
    type : Number,
    default : null , min : [0, " Price cant be negative"]
   },
   maxSensibleSeats: {
    type: Number,
    default: null,
  },
   minSensibleSeats: {
    type: Number,
    default: null,
  },
   useCases: {
    type: [String],
    enum: ["coding", "writing", "research", "customer_support", "data", "mixed" , "others"],
    default: [],
  },
  keyFeatures : {
    type :[String] , 
    default : []
  },
  sourceUrl: {
    type: String,
    required: [true, "Source URL is required"],
    trim: true,
  },
  lastVerified: {
    type: Date,
    required: [true, "Last verified date is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
    default: null,
  },

},{timestamps : true});
AiModelPriceSchema.index({toolName :1 , planName : 1}, {unique : true});
PricingSchema.index({ toolName: 1, isActive: 1 });
PricingSchema.index({ lastVerified: 1 });

ricingSchema.virtual("isStale").get(function () {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.lastVerified < thirtyDaysAgo;
  });

  PricingSchema.statics.getPlansForTool = function (toolName) {
    return this.find({ toolName, isActive: true }).sort({ pricePerSeat: 1 });
  };  

  
PricingSchema.statics.getCheaperPlans = function (toolName, currentPricePerSeat) {
    return this.find({
      toolName,
      isActive: true,
      pricePerSeat: { $lt: currentPricePerSeat },
    }).sort({ pricePerSeat: 1 });
  };

 module.exports =  mongoose.model('AiModelPrice',AiModelPriceSchema );
  

const mongoose = require('mongoose');
const leadSchema = new mongoose.Schema({
    auditId : {
        type : _id,
    } ,   
    email :{
            type: email,
            required: true,
            unique: true,
        },
        name : {
            type : String,   
        },
         company :{
            type : String, 
        },
        title : {type : String},
        emailSent : {type : Boolean, default : false},
} , { timestamps: true });
mongoose.model('Lead', leadSchema);
module.exports = mongoose.model('Lead');
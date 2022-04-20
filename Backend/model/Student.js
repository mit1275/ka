const mongoose = require("mongoose"); 
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({ 
    firstName: { type: String, required: true }, 
    
    lastName: { type: String }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, contactNo: { type: String, required: true },
    adinfo:[{
        title:{
            type:String,
            required:true
        },
        budget:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        Link:{
            type:String,
            required:true
        },
        email:{
            type:String
        },
        data:{
            type:String,
            default:"Not verified"
        }
    },]
    , timestamp: { type: Date, default: Date.now },tokens : [
        {
            token:{
                type : String,
                require:true
            }
        }
    ] }); 

    // GENERATING TOKEN

module.exports = mongoose.model("Student", studentSchema);
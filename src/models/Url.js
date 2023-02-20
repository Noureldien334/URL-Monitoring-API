import mongoose from 'mongoose';

let UrlSchema = new mongoose.Schema({
   
    UserId: {
        type: String,
        required: [true]
    },

    Name:{
        type: String,
        required: [true]
    },

    Url:{
        type: String,
        required: [true],
    },
    
    Protocol:{
        type: String, // Should be Enum
        required: [true],
    },

    Port:{
        type: Number,
    },

    Timeout: {
        type:Number,
        default: 5000, // 5 Seconds
    },
    
    Interval:{
        type: Number,
        default:600000 // 10 minutes 
    },

    Threshold:{
        type: Number,
        default: 1, 
    },

    Authentication:{
        type: { 
            username:{
                type: String
            },
            password:{
                type:String
            }
        }   
    },
    
    HttpHeaders:{ 
        type: [String]
    },


    IgnoreSSL: Boolean
})
UrlSchema = mongoose.model('url', UrlSchema);
export {UrlSchema};
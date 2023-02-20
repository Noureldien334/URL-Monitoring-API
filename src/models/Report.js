import mongoose from 'mongoose';

let ReportSchema = mongoose.Schema({
    URLId: {
        type: String,
        required: [true]
    },
    Status:{
        type: String,
        required: [true]
    }, // Enumeration,

    Availability: {
        type: Number,
        required: [true]
    }, // percentage

    Outage: Number, //Total number of Downtimes
    Downtime: Number, //Total time of downtimes
    Uptime: Number, //Total time of uptime
    ResponseTime: Number, // Average Response Time
    History: [Date], // TimeStamps
})
ReportSchema = mongoose.model('report', ReportSchema);
export {ReportSchema}
import mongoose from 'mongoose';

let ReportSchema = mongoose.Schema({
  //The Check's Owner
  CreatorId: {
    type: String,
    required: [true],
  },
  //Check's URL
  URL: {
    type: String,
    required: [true],
  },
  //Current Status of the URL
  Status: {
    type: String,
    required: [true],
    default: 'Up',
  }, // Enumeration,

  Availability: {
    type: Number,
    default: 0,
  },
  //Total number of Downtimes
  Outage: {
    type: Number,
    default: 0,
  },
  //Total time of downtimes In SECONDS
  // Downtime = Down time / Total Time Monitoring
  DownTime: {
    type: Number,
    required: [true],
    default: 0,
  },

  //Total time of uptim In SECONDS
  // Uptime = 100% - Down time percentage
  UpTime: {
    type: Number,
    required: [true],
    default: 0,
  },
  // Average Response Time
  // Response Time = Time taken to complete a GET Request
  ResponseTime: {
    type: Number,
    required: [true],
    default: 0,
  },

  History: [String],
  // TimeStamps
});
ReportSchema = mongoose.model('report', ReportSchema);
export { ReportSchema };

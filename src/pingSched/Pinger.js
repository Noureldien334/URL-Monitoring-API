import axios from 'axios';
import { ReportSchema } from '../models/Report.js';
import { UrlSchema } from '../models/Url.js';

async function FetchChecks (){
    try{
      const AllChecks = await UrlSchema.find({}); //Get All URLs
      return AllChecks;
    }catch(error){
      console.log(error);
    }
    return 0;
}

async function UpdateDB(Response){
  const query = {
      CreatorId: Response.UserId,
      URL: Response.URL
  };

  const OldData = await ReportSchema.findOne({CreatorId: query.CreatorId, URL: query.URL});
  
  const NewData = await ReportSchema.updateOne({CreatorId: query.CreatorId, URL: query.URL},
                                              { $set: {Status: Response.StatusText,
                                                       ResponseTime : Response.ResponseTime,
                                                       UpTime: (Response.UpTime + OldData.UpTime) ,
                                                       DownTime: Response.DownTime + OldData.DownTime,
                                                       Outage: Response.Outage + OldData.Outage,
                                                       Availability: ((Response.UpTime + OldData.UpTime) / (Response.UpTime + OldData.UpTime + Response.DownTime + OldData.DownTime)) * 100
                                                }}
                                              );
  
}

//Function's Explanation
async function Ping(){
  const ChecksToBePinged = await FetchChecks();
  
  ChecksToBePinged.forEach( async (Check) => {

   await setInterval( () => {
      // Making a get request for the Check's Url with the Specified Configurations
      //axios(Url,{Configs});

      //Calculating Response Time
      
      const StartTime =  Date.now();
      axios.get(Check.Url,{
        method: 'get',
        url: Check.Url,
        timeout: Check.Timeout,
      })
      .then(async (response) => { 
        //In case it's up, the response is here
        const EndTime = Date.now();
        const ResponseTime = EndTime-StartTime;
        await UpdateDB({UserId: Check.UserId,
                        URL: Check.Url,
                        StatusText: 'up',
                        ResponseTime: ResponseTime,
                        UpTime: ResponseTime / 1000,
                        Outage: 0,
                        DownTime: 0,
         });
       
      })
      .catch( async(error) => {
        //In case of Failure, the response is Down
        // We can make a Response Interface, Better coding
        const EndTime = Date.now();
        const ResponseTime = EndTime-StartTime;
        await UpdateDB({UserId: Check.UserId,
                        URL: Check.Url,
                        StatusText: 'down',
                        ResponseTime: ResponseTime,
                        DownTime: ResponseTime / 1000,
                        Outage: 1,
                        UpTime:0,
        }); 
      })}, 10000);
  })
}

export {Ping};

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

async function UpdateDB(PingResult){
  const query = {
    CreatorId: PingResult.UserId,
    URL: PingResult.URL
  };


  const OldRep = await ReportSchema.findOne({CreatorId: query.CreatorId, URL: query.URL});
  await ReportSchema.updateOne({CreatorId: query.CreatorId, URL: query.URL},
                                { $set: {
                                    Status: PingResult.StatusText,
                                    ResponseTime: PingResult.ResponseTime,
                                    UpTime: OldRep.UpTime + PingResult.UpTime,
                                    DownTime: OldRep.DownTime + PingResult.DownTime,
                                    Outage: OldRep.Outage + PingResult.Outage,
                                  }
                                
                                }                               
                              ) 
}

async function Ping(){
  const ChecksToBePinged = await FetchChecks();
  
  ChecksToBePinged.forEach( (Check) => {
    setInterval( async() => {
      //axios(Url,{Configs});
      const StartTime =  Date.now();
      await axios.get(Check.Url,{
        method: 'GET',
        url: Check.Url,
        timeout: Check.Timeout,
      }).then( async(Response) => {
            await PingResult(Check,Response, Date.now()-StartTime);
      }).catch(async (error) => {
            await PingResult(Check,error, Date.now()-StartTime);
      })
    }, 40000);
  })
}

async function PingResult(Check, Result, ResponseTime){
  
  Result.UserId = Check.UserId,
  Result.URL = Check.Url,
  Result.ResponseTime = ResponseTime;
  
  // Check if Status is Up
  if(Result.status == 200){
    Result.StatusText = 'UP',  
    Result.UpTime = ResponseTime / 1000,
    Result.Outage = 0,
    Result.DownTime = 0;    
  }
  //If Status is Down 
  else{
    Result.StatusText = 'Down',  
    Result.UpTime = 0,
    Result.Outage = 1,
    Result.DownTime = ResponseTime / 1000;    
  }
   await UpdateDB(Result);
}

export {Ping};

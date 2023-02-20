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
  
  await ReportSchema.findOneAndUpdate(
      query,
      { $set : {Status:Response.StatusText} }
  );
  
}

//Function's Explanation
async function Ping(){
  const ChecksToBePinged = await FetchChecks();
  
  ChecksToBePinged.forEach( (Check) => {

    setInterval( () => {
      // Making a get request for the Check's Url with the Specified Configurations
      //axios(Url,{Configs});
      axios.get(Check.Url,{
        method: 'get',
        url: Check.Url,
        timeout: Check.timeout,
      })
      .then(async (response) => { 
        //In case it's up, the response is here
        await UpdateDB({UserId: Check.UserId, URL: Check.Url, StatusText: 'up'});
      })
      .catch( async(error) => {
        //In case of Failure, the response is Down
        // We can make a Response Interface, Better coding
        await UpdateDB({UserId: Check.UserId, URL: Check.Url, StatusText: 'down'});
      })}, 5000);
  })
}

export {Ping};

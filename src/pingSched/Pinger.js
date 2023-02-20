import axios from 'axios';
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
  console.log(await PingResult);
  //
}

//Function's Explanation
async function Ping(){
  const ChecksToBePinged = await FetchChecks();
  
  ChecksToBePinged.forEach( (Check) => {

    setInterval( () => {
      // Making a get request for the Check's Url with the Specified Configurations
      
      //axios.get(Url,{Configs});
      axios.get(Check.Url,{
        
      })
      .then((response) => {
        UpdateDB(response);
        //Status is 200 for OK, other than this it's down
      })
      .catch((error) => {
        console.log(Check.Url+" "+error);
      })}, 1000);
      
  })
}

export {Ping};

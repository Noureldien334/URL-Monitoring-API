import axios from 'axios';
import { ReportSchema } from '../models/Report.js';
import { CheckSchema } from '../models/Check.js';
import { SendEmail } from '../utils/SendEmail.js';
import { UserSchema } from '../models/User.js';
async function FetchChecks() {
  try {
    const AllChecks = await CheckSchema.find({}); //Get All URLs
    return AllChecks;
  } catch (error) {
    console.log(error);
  }
  return 0;
}

async function UpdateDB(PingResponse) {
  const query = {
    CreatorId: PingResponse.UserId,
    URL: PingResponse.URL,
  };

  let OldRep = await ReportSchema.findOne({
    CreatorId: query.CreatorId,
    URL: query.URL,
  });

  await ReportSchema.updateOne(
    { CreatorId: query.CreatorId, URL: query.URL },
    {
      $set: {
        Status: PingResponse.Status,
        ResponseTime: PingResponse.ResponseTime,
        UpTime: OldRep.UpTime + PingResponse.UpTime,
        DownTime: OldRep.DownTime + PingResponse.DownTime,
        Outage: OldRep.Outage + PingResponse.Outage,
        //Ava. is the summation of Uptime / Uptime + Downtime
        Availability:
          ((OldRep.UpTime + PingResponse.UpTime) /
            (OldRep.UpTime +
              PingResponse.UpTime +
              OldRep.DownTime +
              PingResponse.DownTime)) *
          100,
      },
      $push: { History: new Date() },
    }
  );
  //Check if the Old Status has changed, then send An Email
  if (OldRep.Status != PingResponse.Status) {
    //Get the Reciever's email using it's ID
    const RecieverEmail = await UserSchema.findById(PingResponse.UserId);
    SendEmail(RecieverEmail.Email, {
      subject: 'Status Changed!!',
      text: 'Your ' + PingResponse.URL + ' is back ' + PingResponse.Status,
    });
  }
}

async function Ping() {
  const ChecksToBePinged = await FetchChecks();

  ChecksToBePinged.forEach((Check) => {
    setInterval(async () => {
      //axios(Url,{Configs});
      const StartTime = Date.now();
      await axios
        .get(Check.Url, {
          method: 'GET',
          url: Check.Url,
          timeout: Check.Timeout,
        })
        .then(async (Response) => {
          await PingResult(Check, Response, Date.now() - StartTime);
        })
        .catch(async (error) => {
          await PingResult(Check, error, Date.now() - StartTime);
        });
    }, Check.Interval); // Check.Interval
  });
}

async function PingResult(Check, PingResponse, ResponseTime) {
  (PingResponse.UserId = Check.UserId),
    (PingResponse.URL = Check.Url),
    (PingResponse.ResponseTime = ResponseTime);
  PingResponse.History = Date.now();
  // Check if Status is Up
  if (PingResponse.status == 200) {
    (PingResponse.Status = 'UP'),
      (PingResponse.UpTime = ResponseTime / 1000),
      (PingResponse.Outage = 0),
      (PingResponse.DownTime = 0);
  }
  //If Status is Down
  else {
    (PingResponse.Status = 'Down'),
      (PingResponse.UpTime = 0),
      (PingResponse.Outage = 1),
      (PingResponse.DownTime = ResponseTime / 1000);
  }
  await UpdateDB(PingResponse);
}

export { Ping };

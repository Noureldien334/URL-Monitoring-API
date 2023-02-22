import { UrlSchema } from '../models/Url.js';
import { ReportSchema } from '../models/Report.js';

const GetChecks = async function (req, res) {
  try {
    const AllURLs = await UrlSchema.find({ UserId: req.UserId }); //Get All URLs
    res.status(200).json({ URLs: AllURLs }).end();
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
};

const CreateCheck = async function (req, res) {
  try {
    const CreatedUrl = await UrlSchema.create({
      UserId: req.UserId, // Fetched from Middleware authentication
      Name: req.body.Name,
      Path: req.body.Path,
      Url: req.body.Protocol + req.body.Url + '/' + req.body.Path,
      Protocol: req.body.Protocol,
      Port: req.body.Port,
    });
    res.status(200).json({
      URLDetails: {
        Id: CreatedUrl._id,
        Name: CreatedUrl.Name,
        Url: CreatedUrl.Url,
        Protocol: CreatedUrl.Protocol,
      },
    });
    // ADDING A URL TO THE REPORT PART
    const ReportDocument = {
      CreatorId: req.UserId,
      URL: CreatedUrl.Url,
    };
    const UrlReport = await ReportSchema.create({ ReportDocument });
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
};

const UpdateCheck = async function (req, res) {
  try {
    const filter = { _id: req.params.URLId };
    const update = {
      Name: req.body.Name,
      Protocol: req.body.Protocol,
      Port: req.body.Port,
      Timeout: req.body.Timeout,
      Interval: req.body.Interval,
      Threshold: req.body.Threshold,
      IgnoreSSL: req.body.IgnoreSSL,
    };
    const UpdatedURL = await UrlSchema.findOneAndUpdate(filter, update);
    res.status(200).json({ UpdatedURL }).end();
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
};

const DeleteCheck = async function (req, res) {
  // Make sure the deletor is the creator
  try {
    const DelUrl = await UrlSchema.findById(req.params.URLId);

    //Make sure that the URL ID exists and the Creater ID  == Deletor ID
    if (DelUrl != null && req.UserId == DelUrl.UserId) {
      await UrlSchema.findByIdAndRemove(DelUrl._id);
      res.status(200).json({ message: 'URL deleted Successfully' }).end();
    }
    // Make a two step error handling, one for the NULL URl and
    //the Other for the Wrong User ID
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
};
export { GetChecks, CreateCheck, DeleteCheck, UpdateCheck };

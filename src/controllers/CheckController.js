import { CheckSchema } from '../models/Check.js';
import { ReportSchema } from '../models/Report.js';

const GetChecks = async function (req, res) {
  try {
    const AllURLs = await CheckSchema.find({ UserId: req.UserId }); //Get All URLs
    res.status(200).json({ URLs: AllURLs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CreateCheck = async function (req, res) {
  try {
    const CreatedUrl = await CheckSchema.create({
      UserId: req.UserId, // Fetched from Middleware authentication
      Name: req.body.Name,
      Path: req.body.Path,
      Url: req.body.Protocol + req.body.Url + '/' + req.body.Path,
      Protocol: req.body.Protocol,
      Port: req.body.Port,
      Tags: req.body.Tags,
    });

    res.status(200).json({
      URLDetails: {
        Id: CreatedUrl._id,
        Name: CreatedUrl.Name,
        Url: CreatedUrl.Url,
        Protocol: CreatedUrl.Protocol,
        Tags: CreatedUrl.Tags,
      },
    });

    // ADDING A URL TO THE REPORT PART
    await ReportSchema.create({ CreatorId: req.UserId, URL: CreatedUrl.Url });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const UpdatedURL = await CheckSchema.findOneAndUpdate(filter, update);
    res.status(200).json({ UpdatedURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteCheck = async function (req, res) {
  // Make sure the deletor is the creator
  try {
    const DelUrl = await CheckSchema.findById(req.params.URLId);

    //Make sure that the URL ID exists and the Creater ID  == Deletor ID
    if (DelUrl != null && req.UserId == DelUrl.UserId) {
      await CheckSchema.findByIdAndRemove(DelUrl._id);
      res.status(200).json({ message: 'URL deleted Successfully' }).end();
    } else res.status(401).json({ message: 'UnAuthorized Access!' }).end();

    // Make a two step error handling, one for the NULL URl and
    //the Other for the Wrong User ID
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetChecksByTag = async function (UserId, Tag) {
  const TagChecks = await CheckSchema.find(
    {
      UserId: UserId,
      Tags: { $in: [Tag] },
    },
    { UserId: 1, Url: 2, _id: 0 }
  );
  return TagChecks;
};
export { GetChecks, GetChecksByTag, CreateCheck, DeleteCheck, UpdateCheck };

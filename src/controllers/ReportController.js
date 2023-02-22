import { ReportSchema } from '../models/Report.js';
import { GetChecksByTag } from '../controllers/CheckController.js';

const GetReports = async function (req, res) {
  try {
    const UserReports = await ReportSchema.find({ CreatorId: req.UserId });
    res.status(200).json({ MyReports: UserReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetReportsByTag = async function (req, res) {
  try {
    const Checks = await GetChecksByTag(req.UserId, req.params.Tag);
    let TaggedReports = [];

    for (let i = 0; i < Checks.length; i++) {
      TaggedReports.push(
        await ReportSchema.findOne({
          CreatorId: Checks[i].UserId,
          URL: Checks[i].Url,
        })
      );
    }

    res.status(200).json({ Report: TaggedReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { GetReports, GetReportsByTag };

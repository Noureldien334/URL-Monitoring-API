import { ReportSchema } from '../models/Report.js';

const GetReports = async function (req, res) {
  try {
    const UserReports = await ReportSchema.find({ CreatorId: req.UserId });
    res.status(200).json({ MyReports: UserReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { GetReports };

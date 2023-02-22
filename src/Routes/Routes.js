import express from 'express';
import {
  getUsers,
  RegisterUser,
  loginUser,
} from '../controllers/UserController.js';
import {
  GetChecks,
  CreateCheck,
  DeleteCheck,
  UpdateCheck,
} from '../controllers/CheckController.js';
import { Authenticate } from '../middlewares/Auth.js';
import {
  GetReports,
  GetReportsByTag,
} from '../controllers/ReportController.js';

const router = express.Router();

//User Routes
router
  .get('/', getUsers)
  .post('/Register', RegisterUser)
  .post('/Login', loginUser);

//Url Routes
router
  .use(Authenticate)
  .get('/MyURLs', GetChecks)
  .post('/MyURLs', CreateCheck)
  .delete('/DelURL/:URLId', DeleteCheck)
  .put('/MyURLs/:URLId', UpdateCheck);

//Report Routes
router
  .use(Authenticate)
  .get('/Reports', GetReports)
  .get('/Reports/:Tag', GetReportsByTag);

export { router };

import express from 'express';
import {getUsers,RegisterUser, loginUser} from '../controllers/UserController.js';
import { getUrls, createUrl, DeleteUrl } from '../controllers/UrlController.js';
import {Authenticate} from '../middlewares/Auth.js';
import { GetReports } from '../controllers/ReportController.js';

const router = express.Router();

//User Routes
router.get('/',getUsers)
      .post('/Register',RegisterUser)
      .post('/Login',loginUser);

//Url Routes
router.use(Authenticate)
      .get('/MyURLs',getUrls)
      .post('/MyURLs',createUrl)
      .delete('/DelURL/:URLId',DeleteUrl)   
//   .put('/:URLId', UpdateUrl)

//Report Route
router.use(Authenticate)
      .route('/Reports')
      .get(GetReports);

export {router};

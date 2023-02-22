import { UserSchema } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CheckEmail, CheckUsername } from '../utils/UserUtils.js';

dotenv.config('../../.env');

const getUsers = async (req, res) => {
  // Show all Users
  try {
    const users = await UserSchema.find({});
    res.status(200).json({ users }).end();
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
};

const loginUser = async function (req, res) {
  try {
    const CheckU = await CheckUsername(req.body.Username); // Check if Username exists
    if (!CheckU) res.status(201).json({ message: 'Username not found' });

    //Check if Password matches
    const credentialsValid = await bcrypt.compare(
      req.body.Password,
      CheckU.Password
    );
    if (!credentialsValid) {
      return res.status(201).json({ message: 'Wrong password' });
    }

    //Create Jwt Token
    const JwtToken = jwt.sign({ UserId: CheckU._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .json({
        Token: JwtToken,
      })
      .end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const CheckU = await CheckUsername(req.body.Username); // Check if Username already exists
    const CheckE = await CheckEmail(req.body.Email); // Check if Email already exists

    if (CheckU)
      return res.status(201).json({ message: 'Username Already exists' }).end();
    if (CheckE)
      return res.status(201).json({ message: 'Email Already exists' }).end();

    const user = await UserSchema.create({
      FullName: req.body.FullName,
      Username: req.body.Username,
      Password: await bcrypt.hash(req.body.Password, 10), // Password Encryption
      Email: req.body.Email,
    });

    //creating json web token
    const JwtToken = jwt.sign({ UserId: user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .json({
        Fullname: user.FullName,
        Username: user.Username,
        Email: user.Email,
        Token: JwtToken,
      })
      .end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getUsers, RegisterUser, loginUser };

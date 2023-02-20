import { UserSchema } from "../models/User.js";

// User utils Functions
const CheckUsername = async function  (Username) {
    const result = await UserSchema.findOne({Username: Username}); // Check whether Username is already used
    return result;
}

const CheckEmail = async function (Email) {
    const result = await UserSchema.findOne({Email: Email});
    if (result != null) // If the Email exists return true, otherwise false
      return true;

    return false;
}

export{CheckUsername, CheckEmail};

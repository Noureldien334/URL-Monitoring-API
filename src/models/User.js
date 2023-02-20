import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
    FullName:{
        type: String,
        required: [true, 'Must provide Name'],
        maxLength: [20]
    },
    Username:{
        type: String,
        required: [true, 'Must provide Username'],
        maxLength: [20]
    },
    Password: {
        type: String,
        trim:true,
        required: [true, 'Must provide Password'],
    },
    Email: {
        type: String,
        trim: true,
        required: [true, 'Must provide Email'],
        match:[/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+[.com]$/,
              'Please provide a valid Email']
    }
})
UserSchema = mongoose.model('user', UserSchema);
export {UserSchema};

import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';

dotenv.config({ path: '../../.env' });

//API Configurations
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sendgrid.setApiKey(SENDGRID_API_KEY);

const msg = {
  from: process.env.Sender_Email,
  to: '',
  subject: '',
  text: '',
};

function SendEmail(RecieverEmail, Message) {
  msg.to = RecieverEmail;
  msg.subject = Message.subject;
  msg.text = Message.text;

  sendgrid.send(msg).catch((error) => {
    console.error(error);
  });
}

export { SendEmail };

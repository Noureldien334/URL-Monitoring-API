import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';

dotenv.config({ path: '../../.env' });

//API Configurations
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sendgrid.setApiKey(SENDGRID_API_KEY);

function SendEmail(RecieverEmail, Message) {
  Message.from = process.env.Sender_Email;
  Message.to = RecieverEmail;
  Message.subject = Message.subject;
  Message.text = Message.text;

  sendgrid.send(Message).catch((error) => {
    console.error(error);
  });
}

export { SendEmail };

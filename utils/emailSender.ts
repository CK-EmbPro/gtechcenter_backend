import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  contactMessageEmailTemplate,
  subscriptionMessageEmailTemplate,
} from "../template/emailTemplate";
import { EMAILCONTEXT } from "../constants/emailContext";

dotenv.config();

const senderEmail = process.env.GMAIL_SENDER_EMAIL;
const senderPassword = process.env.GMAIL_SENDER_APP_PASSWORD;
const adminReceiverEmail = process.env.GMAIL_G_WISSEN_RECEIVER_EMAIL;

export const emailSender = (
  email: string,
  context: string,
  subject?: string,
  message?: string,
  contacterNames?: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  let mailOptions;
  if (context === EMAILCONTEXT.CONTACT) {
    mailOptions = {
      from: senderEmail,
      to: adminReceiverEmail,
      subject: `New Inquiry : ${subject}`,
      html: contactMessageEmailTemplate(
        contacterNames!,
        email,
        subject!,
        message!
      ),
    };
  }

  if (context === EMAILCONTEXT.SUBSCRIPTION) {
    mailOptions = {
      from: senderEmail,
      to: email,
      subject: `SUCCESSFULLY SUBSCRIBED TO G-WISSEN`,
      html: subscriptionMessageEmailTemplate(email),
    };

  }

  transporter.sendMail(mailOptions!, (error, result) => {
    if (error instanceof Error) {
      return console.error("Error sending mail ", error.message);
    }

  });
};

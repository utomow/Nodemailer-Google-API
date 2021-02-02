
exports.createNotificationObject = (residentEmail, subject, textBody, htmlBody) => {
  const mailOptions = {
    from: "Administrator <homy.evolveu@gmail.com>",
    to: residentEmail,
    subject: subject,
    text: textBody,
    html: `<p>${htmlBody}</p>`
  }

  return mailOptions
}

exports.sendNotification = async (mailOptions) => {

  "use strict";
  const nodemailer = require("nodemailer");   // module needed for sending web mail
  const { google } = require("googleapis");     // module to help using google mail API

  // module for using the environment variables inside the .env file, but currently not used since the keys are
  // declared directly in the code
  require("dotenv").config();

  // Keys for representing homy.evolveu@gmail.api clientId and clientSecret in using google API
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

  // The URI for endpoints when we make our API call
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

  // The token needed to refresh the access token in using google API service
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";

  // Creating oauth2 access object from googleapis module class
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  // Setting the refresh token credentials for the oauth2 access object
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })



  async function sendMail(mailOptions) {
    try {
      // getting access token from google with oauth2 object through getAccessToken method. FYI, the accessToken has expiry of 1 hour
      // That is why it is always needed to get new access token before sending the mail
      const accessToken = await oAuth2Client.getAccessToken()

      // Creating transport object for sending email using the nodemailer class
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "homy.evolveu@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
        // Based on information found on the web, the following line is required to prevent unauthorized error
        tls: { rejectUnauthorized: false }
      })

      // Creating the mail options object to be passed on when sending the mail
      // This is where we create the email itself for the header and body of the email.

      // Sending the email, transport class has sendMail method for sending the email. It is an async function and return a promise
      // therefore put the await when calling
      const result = await transport.sendMail(mailOptions)
      return result;  // Getting return value from transport.sendMail which contains the confirmation and other information

    } catch (error) {
      return error;
    }
  }

  // Calling our sendMail function
  return await sendMail(mailOptions)
}


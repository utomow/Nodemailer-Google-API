const { sendNotification, createNotificationObject } = require('./notification');


const residentEmail = "patrickdion8@gmail.com";
const subject = "This is a test for Homy!"
const textBody = "This is a test for Homy!"
const htmlBody = "This is a test for Homy!"

const notificationObject = createNotificationObject(residentEmail, subject, textBody, htmlBody)
console.log(notificationObject)
sendNotification(notificationObject)
    .then(result => console.log("Email sent...", result))
    .catch((error) => console.log(error.message));
const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO;

let client = new SendMailClient({ url, token });

const sendEmail = async (subject, message, to, from, reply_to) => {
  client
    .sendMail({
      bounce_address: "NOREPLY@bounce.ardilla.africa",
      from: {
        address: "noreply@ardilla.africa",
        name: "Ardilla",
      },
      to: [
        {
          email_address: {
            address: `${to}`,
            // name: `${name}`,
          },
        },
      ],
      subject: subject,
      htmlbody: message,
    })
    .then((resp) => console.log("success", resp))
    .catch((error) => console.log("error", error));
};

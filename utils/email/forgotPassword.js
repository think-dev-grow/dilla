const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO;

let client = new SendMailClient({ url, token });

const resetPassword = (to, name, username, token) => {
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
            name: `${username} ${name}`,
          },
        },
      ],
      subject: "Reset password",
      htmlbody: `<table
        cellSpacing="0"
        cellPadding="0"
        style="background-image: url(https://i.postimg.cc/g0B05pW5/background-6.png); border: 1px solid #eee; width: 100%;">
        <tbody>
          <tr>
            <td>
              
              <div style="background-image: url(https://i.postimg.cc/pXgHF8bN/Background-2.png); border: 1px solid #eee; box-sizing: border-box; font-family: 'ubuntu',sans-serif; padding: 90px 50px; margin: 40px auto; max-width: 600px;  width: 600px;">
  
              <div style="display: flex; align-items: center; padding-bottom: 20px; margin-bottom: 30px;">
                 
                    
           
              
              <div style="text-align: center;">
                
                    
                    <img style="width: 104.06px;height: 38.77px; margin-top: 70px;" src="https://i.postimg.cc/NjcpQcYP/Logo-1.png" alt="Logo">
  
                    <hr style="color: gray/300;margin-top: 39.09px;">
  
                    <img style="margin-top: 40px;" src="https://i.postimg.cc/GtXGRFmK/Mask-group.png" alt="illustration">
  
                    <p style="margin-top: 38.79px; height: 93px; font-weight: 500;font-size: 16.71px; color: gray/600;font-family: 'ubuntu',sans-serif;text-align: center;">We received a password reset request from your account. If you  did not make this request, please contact our customer support team at hello@ardilla.africa or call 01345261<br> 
                      <br> Click the button below to reset your password:
                    </p>
                    https://ardilla-web.netlify.app
  
                    <div style="margin-top:70px;">
                    <a href=${token} clicktracking=off style="width: 377.36px; height: 55.98px; border-radius: 93.3px;padding: 10.19px;gap: 10.19px;background-color: #8807F7; justify-content: center;align-items: center; font-size: 15.55px; line-height: 17.87px;font-weight: 700;font-family: 'ubuntu',sans-serif;margin-top: 50.68px;border: none; color: white;cursor: pointer; text-decoration: none;" >Reset password</a>
                    </div>
                  
                   
                   <p style=" height: 94px; left: 116px;font-weight: 500;font-family: 'ubuntu',sans-serif;text-align: center;font-size: 16.71px;color:#4B5563;font-style: normal;margin-top: 41px;">Please note that this link will expire after 1hour.<br><br>Thank you for choosing ardilla. Your access to More butter, More bread, & More money
                   </p>
                    <p style="color: #4B5563;height: 26px;font-size: 14.2px;font-weight: 600; margin-top: 45px; ">The Ardilla Team</p>
                    <p style="font-size: 12.86px;color: #6B7280;font-weight: 500;font-family: 'ubuntu',sans-serif;height: 25px;font-style: normal; margin-top: 25px;">Copyright © 2022 Ardilla. All rights reserved.</p>
  
   
                    
                   
     
                  </div>
  
                
                </div>
                </div>
            </td>
          </tr>
        </tbody>
      </table>`,
    })
    .then((resp) => console.log("success", resp))
    .catch((error) => console.log("error", error));
};

module.exports = resetPassword;

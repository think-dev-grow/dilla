const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO;

let client = new SendMailClient({ url, token });

const sendVerificationMail = (to, value) => {
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
            name: "",
          },
        },
      ],
      subject: "Email verifaction",
      htmlbody: `
  
        <body style="margin: 0;">
      
          <table
            cellSpacing="0"
            cellPadding="0"
            style="background-image: url(https://i.postimg.cc/g0B05pW5/background-6.png); border: 1px solid #eee; width: 100%; padding-bottom: 25px;">
            <tbody>
              <tr>
                <td>
                
                  <div style="background-image: url(https://i.postimg.cc/pXgHF8bN/Background-2.png); border: 1px solid #eee; box-sizing: border-box; font-family: 'ubuntu',sans-serif; padding: 90px 50px; margin: 40px auto; max-width: 600px;  width: 600px;">
  
               
  
                    
                     <div style="display: flex; align-items: center; padding-bottom: 20px; margin-bottom: 30px;">
                 
                    
           
  
                        <div style="text-align: center;">
                    
                    
                        
                            <img style="width: 104.06px;height: 38.77px; " src="https://i.postimg.cc/NjcpQcYP/Logo-1.png" alt="Logo">
                            
                            <hr style="color: gray/300;margin-top: 39.09px;">
  
  
                            <img style="margin-top: 40px;" src="https://i.postimg.cc/GtXGRFmK/Mask-group.png" alt="illustration">
  
                          
  
                            <p style="font-size: 16px;font-weight: 500;font-family: 'ubuntu',sans-serif;text-align: center;color:#4B5563; margin-top: 41px;">
                            Please use the OTP code below to complete your account setup.
                          </p>
  
                          <h3 style="font-size: 30px; font-weight: 600; margin: 0; line-height: 22px; color:#383636;">${value}</h3>
  
                            <p style="color: #4B5563;font-family: 'ubuntu',sans-serif;font-style: normal;font-size: 16px;font-weight: 500;margin-top: 30px;"">Have Fun</p>
                            <p style="color: #4B5563;height: 26px;font-size: 14.2px;font-weight: 600;line-height: 26px; margin-top: 28px;">The Ardilla Team</p>
                            <p style="font-size: 12.86px;color: #6B7280;font-weight: 500;font-family: 'ubunt',sans-serif;height: 25px;font-style: normal; margin-top: 20px;">Copyright © 2022 Ardilla. All rights reserved.</p>
        
        
                        
                        
          
                        </div>
      
                    
                      </div>
                    </div>
                </td>
              </tr>
            </tbody>
          </table>
      </body>
   `,
    })
    .then((resp) => console.log("success", resp))
    .catch((error) => {
      console.log("error", error);
    });
};

module.exports = sendVerificationMail;

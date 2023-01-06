const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO;

let client = new SendMailClient({ url, token });

const ceoMail = (to, name) => {
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
            name: `${name}`,
          },
        },
      ],
      subject: "CEO of Ardilla",
      htmlbody: `  <table
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
  
                    <p style="margin-top:88.23px;font-size: 20px;font-weight: 500;font-family: 'ubuntu',sans-serif;color: #4B5563; text-align:justify">Hi ${name},</p>
                    <div style="display: flex;flex-direction: row; justify-content: center;align-items: center;">
                          <img style=" width: 190px; height:150px;" src="https://i.postimg.cc/vTvKrNHz/Frame-388.png" alt="Frame-1">
                      
                              <div style="font-size: 15px;font-weight: 500;color:#4B5563;font-family: 'ubuntu',sans-serif;margin-top: 57px;">
                              
                                  <h3 style="color: black;font-size: 15px;"><b>My name is Onyinye Cheryl Dallas,
                                      <br>CEO of Ardilla.</h3>
                                   
                                      <p style=" padding-left: 25px; font-size: 12px; text-align: left; ">Having you on board in the Ardilla community means so much to the team. We are eager to help you start
                                      your journey to building wealth.<br>
                                      Freedom means different things to everyone, but at Ardilla, it means making smart financial decisions today so that we live tomorrow without restrictions.</p>     
                              </div>
                             <div >
                                <img width="90px" height="90px" style="margin-top: -127px;" src="https://i.postimg.cc/HLJdwKPH/Mask-group-1.png" alt="Mask"> 
                             </div>
                    </div>
      
                    <div style="display: flex;flex-direction: row; ">
                      <p style="font-size: 12px;font-weight: 500;font-family: 'ubuntu',sans-serif;text-align: left;color: #4B5563;margin-top:70px">
                       <b> There are quite a number of tools on the Ardilla platform, including savings, investments, and <br> financial education, that allows you take charge of your future now.
                      </p>
                      <div style="float: inline-end;">
                         <img width="170px" height="160px" style="margin-top: 35px;" src="https://i.postimg.cc/6QC1xf8n/Frame-407.png" alt="Frame-2">
                      </div>
                    </div>
                    <p style="font-weight: 500;text-align: center;color: #4B5563;margin-top: 60px;font-size: 13px;font-family: normal;font-family: 'ubuntu',sans-serif;">
                     <b>I look forward to your journey. I am sure it will be great. Please do not hesitate to contact our team if you need assistance. We are available to you 24/7.</p>
                    <div style="display:flex;flex-direction: row;align-items: center; background-image: url(https://i.postimg.cc/zBXmdhV5/Background-4.png);background-color: #3D0072;width: 503px;height:140.63px;border-radius: 11.94px;margin-top: 30px; text-align: center;">
                        <div>
                            <h3 style="font-weight: 700;color: #FFFFFF;font-size: 18px;font-style: normal;padding-top: 26px;padding-left:35px;font-family: Arial, Helvetica, sans-serif; text-align: left;">Download for free<br> Start saving Today</h3>
                            <input style=" font-size:13px;height: 29.25px; background-color: #FFFFFF;color: #3D0072;border-radius: 4.78px;padding: 20px,30px;border: none;cursor: pointer;"  type="button" value="Download for free">
                        </div>
                            <img  width="180px" height="90px" style="margin-top: 50px; margin-left: 90px;" src="https://i.postimg.cc/nzY4Lsks/Phone.png" alt="Phone">
                    </div> 
                    <h3 style="font-size: 13px;font-weight: 500;font-family: 'ubuntu',sans-serif;text-align: center;color: gray/600;margin-top: 30px;"><b>Ardilla, 33B, Ogundana street, Allen, Ikeja, Lagos</h3>
                      <div style="display: flex;flex-direction: row;margin-top: 40px; justify-content: center; align-items: center;" >
                          <a href="#"><img  src="https://i.postimg.cc/GhQbjbMk/Facebook-logo.png" alt="Facebook-icon"></a>
                          <a href="#"><img style="padding-left: 15px;"  src="https://i.postimg.cc/8cZnjXHr/linkedin-logo.png" alt="Linkedin-icon"></a>
                          <a href="#"><img style="padding-left: 15px;"  src="https://i.postimg.cc/pX9BfdVS/twitter-logo.png" alt="Twitter-icon"></a>
                       </div>
      
                      <h3 style="color: #4B5563;font-size: 13px;font-weight: 500;margin-top: 60.02px;text-align:center;font-family: 'ubuntu',sans-serif;"><b>You are receiving this message because you signed up on Ardilla.  If you would like to stop receiving tips on financial literacy, you can opt out by clicking unsubscribe. For more information about how we process data please see our Privacy Policy </h3>
         
                  
                    <p style="color: #4B5563;height: 26px;font-size: 14.2px;font-weight: 600;line-height: 26px; margin-top: 28px; text-align: center;">The Ardilla Team</p>
                    <p style="font-size: 12.86px;color: #6B7280;font-weight: 500;font-family: 'ubunt',sans-serif;height: 25px;font-style: normal; margin-top: 20px;text-align: center;">Copyright © 2022 Ardilla. All rights reserved.</p>
      
      
        
                   
      
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

module.exports = ceoMail;

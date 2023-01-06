const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO;

let client = new SendMailClient({ url, token });

const supportMail = (to, name) => {
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
      subject: "Glad to have you onboard",
      htmlbody: `
       
        <table
        cellSpacing="0"
        cellPadding="0"
        style="background-image: url(https://i.postimg.cc/g0B05pW5/background-6.png); border: 1px solid #eee; width: 100%; padding-bottom: 25px;">
        <tbody>
          <tr>
            <td>
              
              <div style="background-image: url(https://i.postimg.cc/pXgHF8bN/Background-2.png); border: 1px solid #eee; box-sizing: border-box; font-family: 'ubuntu',sans-serif; padding: 90px 50px; margin: 40px auto; max-width: 600px;  width: 600px;">
                <div style="display: flex; align-items: center; padding-bottom: 980px; margin-bottom: 30px;">
  
                  <div style="text-align: center; font-style:normal; width: 633px; margin-top: -75px;">
                    
                    <img style="margin-top: 30px;" src="https://i.postimg.cc/NjcpQcYP/Logo-1.png" alt="Logo">
  
                    <hr style="color: gray/300;margin-top: 25.09px;">
                    <img style="margin-top: 40px;" src="https://i.postimg.cc/GtXGRFmK/Mask-group.png" alt="illustration">
                    <h2 style="color: gray/600;font-weight: 500;text-align: center;font-size: 30px;margin-top: 26px;font-family:'ubuntu',sans-serif;"> Hi ${name}</h2>
                    
  
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px;">
                      <img  width="150px" height="120px"   src="https://i.postimg.cc/vTvKrNHz/Frame-388.png" alt="">
  
                      <div style="margin: 0 12px; margin-bottom: -40px; display: flex;  justify-content: space-between;">
                        <div>
  
                          <div style="display: flex;align-items: center; margin-top: 15px;">
                            <img  width="60px" height="48px"  src="https://i.ibb.co/PFKtCfd/Frame-220.png" alt="">
      
                            <h3>Saving</h3>
    
                          </div>
    
                          <h3 style="font-weight: 600;font-size: 13px;color: gray/600;font-family:'ubuntu',sans-serif;font-style: normal;  text-align: justify; margin-top: 10px; padding-left: 10px;">We help you save your money daily, weekly, or monthly. No pressure. We work at your pace.</h3>
                        </div>
                        <div style="margin-top: -20px;">
                          <img  width="100px" height="80px"  src="https://i.postimg.cc/P5HR3h8M/Frame-371.png" alt="">
                        </div>
                       
                      </div>  
  
  
                    </div>
  
                    <div style="display: flex;flex-direction: row; margin-top: 40px;">
                      <div>
                        <div style="display: flex;align-items:center;">
                          <img width="60px" height="48px" style="border-radius: 9.74px;"  src="https://i.postimg.cc/ht3VJ1g7/Frame-221.png" alt="Frame4">
                          <h2 style=" font-size:20px;font-style: normal;font-weight: 700;color: #3D0072; font-family:'ubuntu',sans-serif;"> Investment</h2>
                        </div>
       
                        <p style="font-weight: 600;font-size: 13px;color: gray/600;font-family:'ubuntu',sans-serif;font-style: normal;  text-align: justify; margin-top: 10px; padding-left: 10px;">We provide multiple, easy to understand investment opportunities for you. Yes, saving is great but investing is so much better.</p>
                      
                      </div>
                     <div style="padding-left: 20px;">
                      <img width="190px" height="150px"  src="https://i.postimg.cc/9QGtk7j4/Frame-389.png" alt="Frame5">
                     </div> 
                    </div>
  
  
                    <div style="display: flex;flex-direction: row; margin-top: 75px; padding-left: 20px;">
                      <img width="190" height="150"  src="https://i.postimg.cc/Qx7zJm01/Frame-395.png" alt="Frame6" >
                      <div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                          <img width="60" height="48" style="border-radius: 9.74px;" src="https://i.postimg.cc/g0jqNkmQ/Frame-372.png" alt="Frame-7">
                          <h3 style="font-size: 20px;font-style: normal;font-weight: 700;color:#3D0072;font-family:'ubuntu',sans-serif;">Financial literacy</h3>
                        </div>
                        <p style="font-size: 13px;font-weight: 600;color: #4B5563;font-family:'ubuntu',sans-serif; text-align: justify; padding-left: 10px;">At Ardilla, we believe financial freedom begins with the right information. Ardila offers wealth-building tips from great financial minds to help you get to where you need to be.</p>
                       
                      </div>
                              
                    </div>
  
                    <div style="display:flex;flex-direction: row;align-items: center; background-image: url(https://i.postimg.cc/zBXmdhV5/Background-4.png);background-color: #3D0072;width: 503px;height:140.63px;border-radius: 11.94px;margin-top: 70px; text-align: center;">
                       <div>
                          <h3 style="font-weight: 700;color: #FFFFFF;font-size: 18px;font-style: normal;padding-top: 26px;padding-left:40px;font-family: Arial, Helvetica, sans-serif; text-align: left;">Download for free<br> Start saving Today</h3>
                          <input style=" font-size:13px;height: 29.25px; background-color: #FFFFFF;color: #3D0072;border-radius: 4.78px;padding: 20px,30px;border: none;cursor: pointer; margin-top: -15px;"  type="button" value="Download for free">
                       </div>
                          <img  width="180px" height="90px" style="margin-top: 53px; margin-left: 90px;" src="https://i.postimg.cc/nzY4Lsks/Phone.png" alt="Phone">
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
   
        `,
    })
    .then((resp) => console.log("success", resp))
    .catch((error) => console.log("error", error));
};

module.exports = supportMail;

//we can make the email dynamic, we use this in controller

import * as config from "../config.js";

const style=`
background:#eee;
padding:20px;
border-radius:20px;
`

export const emailTemplate = (email, content, replyTo, subject) => {
    return (
        {
            Source: config.EMAIL_FROM,
            //Destination:req.body.email //the email which user fill.
            Destination: {
              //but we hard coded now. but this timebeing it have to verify from aws. when the website is on prodution we can buy a ticket to send and recieve email
              ToAddresses: [email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  //this is how we can inject html using '``'
                  Data: ` 
                  <html>
                  <h1 style="${style}">Hello from HFE! We welcome you :)</h1>
                  ${content}
                  <p>&copy; ${new Date().getFullYear()}</p>
                  </html>
                  `,
                  //matlab aisa krne se jb user verify krega email toh jo token jayega usko decode krke
                  //hum user ki email password le skte hai or database mae dal skte hai.
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Welcome to HFE",
              },
            },
          }
    )
};

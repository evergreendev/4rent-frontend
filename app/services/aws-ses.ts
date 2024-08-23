"use server"
import * as AWS from "aws-sdk";
import * as nodeMailer from "nodemailer";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    region: "us-east-2",
});
AWS.config.getCredentials((err, credentials) => {
    if (err) {
        console.error(err.stack);
    }
});
const ses = new AWS.SES({apiVersion: "latest"});

const adminMail = "noreply@4rentblackhills.com";

const transporter = nodeMailer.createTransport({
    SES: ses
});

export const sendMail = async (prevState: any, formData: FormData) => {
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const propertyName = formData.get("propertyName");
    const phone = formData.get("phone");
    let error = "";

    if(!email){
        error += "Please enter a valid email address. ";
    }
    if(!firstName){
        error += "Please enter a valid first name. ";
    }
    if(!lastName){
        error += "Please enter a valid last name. ";
    }
    if(!phone){
        error += "Please enter a valid phone number. ";
    }

    if (error){
        return {
            message:"",
            error:error
        }
    }

    try {
        await transporter.sendMail({
            from: adminMail,
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            replyTo: email as string,
            subject: `New Contact form submission from ${firstName} ${lastName} (4rentblackhills.com)`,
            html: `
            <!DOCTYPE html >
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>test</title>
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px; margin: 0 auto;">
<div style="background: #4d5766">
<img style="margin: auto; display: block" alt="4Rent Black Hills" src="https://4rentblackhills.com/_next/image?url=https%3A%2F%2Fbackend.4rentblackhills.com%2Fmedia%2F4rent-light.png&w=384&q=75">
</div>
<p>
Name: ${firstName} ${lastName} <br/>
Email: ${email} <br/>
Phone: ${phone} <br/>
Property Name: ${propertyName}
</p>
</div>
</div>
</body>
</html>
            `
        });
//confirmation email
        await transporter.sendMail({
            from: adminMail,
            to: email as string,
            replyTo: adminMail,
            subject: `Contact form submission confirmation (4rentblackhills.com)`,
            html: `
            <!DOCTYPE html >
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>test</title>
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px; margin: 0 auto;">
<div style="background: #4d5766">
<img style="margin: auto; display: block" alt="4Rent Black Hills" src="https://4rentblackhills.com/_next/image?url=https%3A%2F%2Fbackend.4rentblackhills.com%2Fmedia%2F4rent-light.png&w=384&q=75">
</div>
<p>
This is to acknowledge your recent contact form submission from (4rentblackhills.com)<br/>
Name: ${firstName} ${lastName} <br/>
Email: ${email} <br/>
Phone: ${phone} <br/>
Property Name: ${propertyName}
</p>
</div>
</div>
</body>
</html>
            `
        });

        return {
            message: "Thank you for your interest in 4rent Black Hills. We'll be in touch soon and look forward to speaking with you.",
            error: ""
        }

    } catch (e) {
        console.error(e);
        return {error: "There was a problem sending your message please try again later.", msg: ""}
    }


}

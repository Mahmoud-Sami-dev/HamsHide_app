import nodemailer from "nodemailer";

export async function sendOTPEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth:{
        user: "nassefm807@gmail.com",
        pass: "ukkz crkz vejc mkba"
    },
   
  });
  const mailOptions={
    from:"nassefm807@gmail.com",
    to: toEmail,
    subject: "OTP Verification",
    text:`Your OTP code is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

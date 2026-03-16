import nodemailer from "nodemailer";
export const sendMail = async ({ to, subject, html } = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "nassefm807@gmail.com",
      pass: "yytn ujkl pewy kjis",
    },
  });

  await transporter.sendMail({
    from: '"saraha app"<nassefm807@gmail.com>',
    to,
    subject,
    html,
  });
};

import nodemailer from 'nodemailer';

export async function sendLoginEmail({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Jane Doe" <j.doe@example.com>',
    to: email,
    subject: 'Login to your account',
    html: `
      <div>
        <p>Your new app login OTP: ${otp}
      </div>`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

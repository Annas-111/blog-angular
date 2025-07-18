import * as nodemailer from 'nodemailer';

export async function sendOtpToEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #4A90E2; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">Use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="margin: 20px 0; text-align: center;">
            <span style="display: inline-block; background-color: #f0f0f0; padding: 12px 24px; font-size: 24px; letter-spacing: 4px; border-radius: 6px; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #e53935; font-weight: bold; text-align: center;">
            ⚠️ This OTP will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If you didn’t request this, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #777;">Thanks,<br/>Blog App Team</p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
Your OTP code is: ${otp}

This OTP will expire in 10 minutes.

If you didn’t request this code, you can safely ignore this email.

Thanks,
Blog App Team
  `;

  await transporter.sendMail({
    from: `"Blog App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code - Blog App',
    text: textContent,
    html: htmlContent,
  });
}

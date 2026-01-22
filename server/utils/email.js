import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <h1>Verifikasi Email Anda</h1>
    <p>Halo ${user.fullName},</p>
    <p>Terima kasih telah mendaftar di ADMA University Alumni System.</p>
    <p>Silakan klik link di bawah ini untuk memverifikasi email Anda:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verifikasi Email</a>
    <p>Atau copy link berikut ke browser Anda:</p>
    <p>${verificationUrl}</p>
    <p>Link ini akan kadaluarsa dalam 24 jam.</p>
    <p>Jika Anda tidak mendaftar, abaikan email ini.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Verifikasi Email - ADMA Alumni',
    html
  });
};

export const sendResetPasswordEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h1>Reset Password</h1>
    <p>Halo ${user.fullName},</p>
    <p>Anda menerima email ini karena Anda (atau seseorang) telah meminta reset password.</p>
    <p>Silakan klik link di bawah ini untuk mereset password Anda:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>Atau copy link berikut ke browser Anda:</p>
    <p>${resetUrl}</p>
    <p>Link ini akan kadaluarsa dalam 1 jam.</p>
    <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Reset Password - ADMA Alumni',
    html
  });
};

export const sendEventReminderEmail = async (user, event) => {
  const html = `
    <h1>Reminder: ${event.title}</h1>
    <p>Halo ${user.fullName},</p>
    <p>Ini adalah pengingat untuk event yang akan datang:</p>
    <h2>${event.title}</h2>
    <p><strong>Tanggal:</strong> ${new Date(event.startDate).toLocaleDateString('id-ID')}</p>
    <p><strong>Waktu:</strong> ${new Date(event.startDate).toLocaleTimeString('id-ID')}</p>
    <p><strong>Lokasi:</strong> ${event.location || event.onlineLink}</p>
    <p>Sampai jumpa di event!</p>
  `;

  await sendEmail({
    email: user.email,
    subject: `Reminder: ${event.title}`,
    html
  });
};

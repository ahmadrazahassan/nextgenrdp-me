// src/utils/email.ts
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure email transport
const createTransporter = () => {
  // For production, use actual SMTP credentials
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  
  // For development, use ethereal.email (fake SMTP service)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email', // Replace with actual ethereal credentials
      pass: 'ethereal_pass',
    },
  });
};

// Generate verification token and store in database
export async function createEmailVerification(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration
  
  await prisma.emailVerification.create({
    data: {
      userId,
      verificationToken: token,
      expiresAt,
    },
  });
  
  return token;
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string) {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'auth@example.com',
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify Email Address</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

// Generate password reset token and store in database
export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    return null;
  }
  
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    },
  });
  
  return { user, token };
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = createTransporter();
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'auth@example.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });
  
  return user;
}

// Send account activity notification
export async function sendAccountActivityEmail(email: string, activity: string, ipAddress?: string, userAgent?: string) {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'auth@example.com',
    to: email,
    subject: 'Account Activity Notification',
    html: `
      <h1>Account Activity Notification</h1>
      <p>We detected the following activity on your account:</p>
      <p><strong>${activity}</strong></p>
      <p>Details:</p>
      <ul>
        <li>IP Address: ${ipAddress || 'Unknown'}</li>
        <li>Device: ${userAgent || 'Unknown'}</li>
        <li>Time: ${new Date().toLocaleString()}</li>
      </ul>
      <p>If this wasn't you, please secure your account immediately by changing your password.</p>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

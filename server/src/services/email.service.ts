// src/services/email.service.ts

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Initialize the Nodemailer transporter once
let transporter: Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        // --- SENDGRID SMTP CONFIGURATION ---
        transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net", 
            port: 587, 
            secure: false, // Use false for port 587 (STARTTLS)
            auth: {
                user: "apikey", // The literal string "apikey" for SendGrid SMTP
                pass: process.env.SENDGRID_API_KEY, // Your full API Key is used as the password
            },
        });
        
        // Optional: Verify connection for debugging
        transporter.verify((error, success) => {
            if (error) {
                console.error("🚨 SendGrid connection failed. Check SENDGRID_API_KEY:", error);
            } else {
                console.log("✅ SendGrid server is ready to take messages.");
            }
        });
    }
    return transporter;
};


/**
 * Sends an email using Nodemailer via SendGrid.
 */
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; message: string }> => {
    
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
        console.error("FATAL: SendGrid configuration (API Key or Sender Email) is missing.");
        throw new Error("Email configuration missing.");
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM, 
            to: to,
            subject: subject,
            html: htmlContent,
        };

        const result = await getTransporter().sendMail(mailOptions);
        
        console.log(`Email sent to ${to}. Message ID: ${result.messageId}`);
        
        return { success: true, message: "Email sent successfully via SendGrid." };
    } catch (error) {
        console.error("Error sending email via SendGrid:", error);
        throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
};


/**
 * Helper to generate the content for an invitation email.
 */
export const generateInviteEmailContent = (
    inviterName: string,
    sessionName: string,
    inviteLink: string
): { subject: string; html: string } => {
  const subject = `You've been invited to collaborate on ${sessionName}!`;
  const html = `
    <p>Hello,</p>
    <p><strong>${inviterName}</strong> has invited you to join a collaborative coding session named <strong>"${sessionName}"</strong>.</p>
    <p>Click the link below to accept the invitation and join the workspace:</p>
    <p><a href="${inviteLink}">Accept Invitation and Join Session</a></p>
    <br>
    <p>This link is valid for 7 days.</p>
    <p>Happy coding!</p>
  `;

  return { subject, html };
};
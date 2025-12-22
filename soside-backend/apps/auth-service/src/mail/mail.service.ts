import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor() {
        // For development, you can use ethereal.email or local mailtrap
        // In production, use your professional SMTP settings
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER || 'your-ethereal-user',
                pass: process.env.MAIL_PASS || 'your-ethereal-pass',
            },
        });
    }

    async sendVerificationEmail(email: string, code: string) {
        const mailOptions = {
            from: '"SOSIDE" <no-reply@soside.com>',
            to: email,
            subject: 'Verify your account',
            text: `Your verification code is: ${code}`,
            html: `<b>Your verification code is: ${code}</b>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error);
        }
    }

    async sendTwoFactorCode(email: string, code: string) {
        const mailOptions = {
            from: '"SOSIDE" <no-reply@soside.com>',
            to: email,
            subject: 'Your 2FA Code',
            text: `Your 2FA code is: ${code}`,
            html: `<b>Your 2FA code is: ${code}</b>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`2FA code sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send 2FA code to ${email}`, error);
        }
    }
}

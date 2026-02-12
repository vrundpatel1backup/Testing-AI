import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: String(error) }
  }
}

export function createMissedMessageEmail(
  contactName: string,
  messagePreview: string,
  messageLink?: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6264a7; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; }
          .message { background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .button { display: inline-block; padding: 10px 20px; background-color: #6264a7; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 Missed Teams Message</h2>
          </div>
          <div class="content">
            <p>You have a missed message from <strong>${contactName}</strong> on Microsoft Teams:</p>
            <div class="message">
              <p>${messagePreview}</p>
            </div>
            ${messageLink ? `<a href="${messageLink}" class="button">View in Teams</a>` : ''}
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              This notification was sent by your Teams Gmail Notifier application.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

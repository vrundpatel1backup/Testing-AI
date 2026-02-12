# Teams Gmail Notifier

A Next.js 14 application that monitors Microsoft Teams for missed messages and sends Gmail notifications. Perfect for staying on top of important Teams messages even when you're not actively checking the app.

## Features

- 🔔 **Automated Monitoring**: Checks Teams for missed messages on a schedule
- 📧 **Gmail Notifications**: Sends beautiful email alerts via Gmail SMTP
- 👥 **Contact Management**: Monitor specific people on Teams
- 📊 **Dashboard**: Overview of notifications and activity
- 📜 **History Tracking**: Keep track of all sent notifications
- ⚙️ **Easy Configuration**: Simple settings page for all credentials
- 🚀 **Free Deployment**: Deploy to Vercel with scheduled cron jobs

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Microsoft Graph API with MSAL
- **Email**: Nodemailer with Gmail SMTP
- **Storage**: JSON config file (no database needed)
- **Deployment**: Vercel (with cron job support)

## Prerequisites

Before you begin, you'll need:

1. A Microsoft Azure account (free tier works)
2. A Gmail account with App Password enabled
3. A Vercel account (free tier works)
4. Node.js 18+ installed locally

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd teams-gmail-notifier
npm install
```

### 2. Microsoft Graph API Setup

To access Microsoft Teams data, you need to create an Azure AD application:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
   - Name: `Teams Gmail Notifier`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: `Web` - `https://your-app.vercel.app/api/auth/callback`
4. Click **Register**

5. **Copy these values** (you'll need them later):
   - Application (client) ID
   - Directory (tenant) ID

6. Create a **Client Secret**:
   - Go to **Certificates & secrets** > **New client secret**
   - Description: `Teams Notifier Secret`
   - Expires: Choose your preference (12-24 months recommended)
   - Click **Add** and **copy the secret value immediately** (you won't see it again!)

7. Set **API Permissions**:
   - Go to **API permissions** > **Add a permission**
   - Select **Microsoft Graph** > **Application permissions**
   - Add these permissions:
     - `Chat.Read.All` - Read all chat messages
     - `Mail.Read` - Read mail in all mailboxes
     - `User.Read.All` - Read all users' profiles
   - Click **Grant admin consent** (requires admin privileges)

### 3. Gmail App Password Setup

Gmail requires an "App Password" for SMTP access:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Under "2-Step Verification", scroll to **App passwords**
5. Click **App passwords**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: `Teams Notifier`
6. Click **Generate**
7. **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Microsoft Graph API
MICROSOFT_CLIENT_ID=your_client_id_from_azure
MICROSOFT_CLIENT_SECRET=your_client_secret_from_azure
MICROSOFT_TENANT_ID=your_tenant_id_from_azure
MICROSOFT_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_without_spaces
GMAIL_RECIPIENT=where-to-send-notifications@example.com

# App Configuration
CHECK_INTERVAL_MINUTES=15
NOTIFICATION_DELAY_SECONDS=300

# Cron Secret (generate with: openssl rand -base64 32)
CRON_SECRET=your_random_secret_here
```

### 5. Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

Navigate to the **Settings** page to configure your credentials through the UI.

## Deployment to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 2. Deploy

#### Option A: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Add all environment variables from `.env.local`
6. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
vercel
```

Follow the prompts and add environment variables when asked.

### 3. Configure Cron Jobs

The `vercel.json` file already configures a cron job to run every 15 minutes:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-messages",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Important**: Add the `CRON_SECRET` environment variable in Vercel:

1. Go to your project in Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Add `CRON_SECRET` with a random value (generate with `openssl rand -base64 32`)

### 4. Update Redirect URI

After deployment, update your Microsoft Azure app registration:

1. Go to Azure Portal > Your App Registration
2. Update the Redirect URI with your Vercel URL
3. Update the `MICROSOFT_REDIRECT_URI` environment variable in Vercel

## Usage

### Adding Contacts

1. Navigate to the **Contacts** page
2. Click **Add Contact**
3. Enter the Teams user's email or ID
4. Save the contact

### Checking History

1. Navigate to the **History** page
2. View all sent notifications
3. Filter and search through past alerts
4. Export history if needed

### Configuration

1. Navigate to the **Settings** page
2. Configure Microsoft Graph API credentials
3. Configure Gmail SMTP settings
4. Adjust notification preferences

## Project Structure

```
Testing-AI/
├── app/
│   ├── api/
│   │   └── cron/
│   │       └── check-messages/  # Cron job endpoint
│   ├── contacts/                # Contacts page
│   ├── history/                 # History page
│   ├── settings/                # Settings page
│   ├── layout.tsx               # Root layout with sidebar
│   ├── page.tsx                 # Dashboard page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── sidebar.tsx              # Navigation sidebar
├── lib/
│   ├── gmail.ts                 # Gmail/Nodemailer utilities
│   ├── msgraph.ts               # Microsoft Graph client
│   └── utils.ts                 # Helper utilities
├── config/
│   └── config.json              # JSON storage (gitignored with secrets)
├── .env.example                 # Environment template
├── vercel.json                  # Vercel config with cron
└── README.md                    # This file
```

## How It Works

1. **Scheduled Check**: Vercel cron triggers `/api/cron/check-messages` every 15 minutes
2. **Fetch Messages**: The API calls Microsoft Graph to get unread Teams messages
3. **Filter Contacts**: Only messages from monitored contacts are processed
4. **Check Timing**: If a message has been unread for > 5 minutes (configurable), it's "missed"
5. **Send Notification**: An email is sent via Gmail with the message details
6. **Update History**: The notification is logged to `config.json`

## Customization

### Adjust Check Interval

Edit `vercel.json` to change how often messages are checked:

```json
"schedule": "*/5 * * * *"  // Every 5 minutes
"schedule": "0 * * * *"     // Every hour
"schedule": "0 9-17 * * 1-5" // Every hour, 9am-5pm, weekdays
```

### Modify UI

The app uses Tailwind CSS and shadcn/ui components. Customize:

- Colors: Edit `tailwind.config.ts`
- Components: Modify files in `components/ui/`
- Pages: Edit files in `app/*/page.tsx`

### Notification Delay

Adjust when a message is considered "missed" in Settings or `.env.local`:

```env
NOTIFICATION_DELAY_SECONDS=300  # 5 minutes (default)
```

## Troubleshooting

### Microsoft Graph API Issues

- **401 Unauthorized**: Check your client ID, secret, and tenant ID
- **403 Forbidden**: Ensure API permissions are granted and admin consent is given
- **No messages returned**: Verify the user has Teams messages and permissions are correct

### Gmail SMTP Issues

- **535 Authentication Failed**: 
  - Verify App Password is correct (no spaces)
  - Ensure 2-Step Verification is enabled
  - Try generating a new App Password
- **Connection timeout**: Check firewall and ensure SMTP ports aren't blocked

### Vercel Cron Issues

- **Cron not running**: 
  - Verify you're on a paid Vercel plan (Hobby or Pro) for cron
  - Check `vercel.json` is properly configured
  - View logs in Vercel dashboard
- **401 on cron endpoint**: Ensure `CRON_SECRET` environment variable matches

## Security Notes

- ✅ Never commit `.env.local` or `config/config.local.json` to Git
- ✅ Use environment variables for all secrets in production
- ✅ Rotate client secrets and app passwords regularly
- ✅ Use the minimum required API permissions
- ✅ Enable cron secret verification to prevent unauthorized access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [Microsoft Graph documentation](https://docs.microsoft.com/graph/)
- Review [Nodemailer documentation](https://nodemailer.com/)
- Open an issue on GitHub

---

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS

# Teams Gmail Notifier - Complete Deployment Guide

A Next.js 14 application that monitors Microsoft Teams for missed messages and sends Gmail notifications. Perfect for staying on top of important Teams messages even when you're not actively checking the app.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started - What You'll Need](#getting-started---what-youll-need)
- [Step 1: Create Required Accounts](#step-1-create-required-accounts)
- [Step 2: Fork/Clone the Repository](#step-2-forkclone-the-repository)
- [Step 3: Configure Microsoft Teams (Azure AD)](#step-3-configure-microsoft-teams-azure-ad)
- [Step 4: Configure Gmail for Notifications](#step-4-configure-gmail-for-notifications)
- [Step 5: Set Up Environment Variables](#step-5-set-up-environment-variables)
- [Step 6A: Local Development (Testing)](#step-6a-local-development-testing)
- [Step 6B: Deploy to Vercel (Production)](#step-6b-deploy-to-vercel-production)
- [Step 7: Configure Vercel Cron Jobs](#step-7-configure-vercel-cron-jobs)
- [Step 8: Using the Web UI](#step-8-using-the-web-ui)
- [Local vs Cloud Deployment](#local-vs-cloud-deployment)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Advanced Configuration](#advanced-configuration)

---

## Features

- 🔔 **Automated Monitoring**: Checks Teams for missed messages on a schedule
- 📧 **Gmail Notifications**: Sends beautiful email alerts via Gmail SMTP
- 👥 **Contact Management**: Monitor specific people on Teams
- 📊 **Dashboard**: Overview of notifications and activity
- 📜 **History Tracking**: Keep track of all sent notifications
- ⚙️ **Easy Configuration**: Simple settings page for all credentials
- 🚀 **Free Deployment**: Deploy to Vercel with scheduled cron jobs (no credit card required for free tier!)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Microsoft Graph API with MSAL
- **Email**: Nodemailer with Gmail SMTP
- **Storage**: JSON config file (no database needed)
- **Deployment**: Vercel (with cron job support)

---

## Getting Started - What You'll Need

This guide is designed for beginners. You'll need the following accounts and tools:

### Required Accounts (All FREE!)
1. ✅ **GitHub Account** - To fork/clone the repository
2. ✅ **Vercel Account** - To deploy and host the application (free tier)
3. ✅ **Microsoft Azure Account** - To access Teams API (free tier)
4. ✅ **Gmail Account** - To send notification emails (free)

### Required Tools
- **Node.js 18+** - To run the application locally (optional for testing)
- **Git** - To clone the repository
- **A Web Browser** - For configuration and testing

### Time Estimate
- **First-time setup**: 30-45 minutes
- **Subsequent deployments**: 5-10 minutes

---

## Step 1: Create Required Accounts

If you don't have these accounts yet, create them now. All are completely free!

### 1.1 GitHub Account
**Purpose**: Store your code and connect to Vercel for automatic deployments

1. Go to [GitHub](https://github.com/signup)
2. Click **Sign up**
3. Follow the prompts to create your account
4. Verify your email address

**✅ You're done when**: You can log in to GitHub.com

### 1.2 Vercel Account  
**Purpose**: Host your application for free and run scheduled checks

1. Go to [Vercel](https://vercel.com/signup)
2. Click **Sign up**
3. **Recommended**: Sign up using your GitHub account (makes deployment easier)
4. Complete the onboarding wizard

**✅ You're done when**: You can see the Vercel dashboard

**💡 Note**: Vercel's free "Hobby" tier includes everything you need including cron jobs!

### 1.3 Microsoft Azure Account
**Purpose**: Access Microsoft Teams data via Microsoft Graph API

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Start free** or **Sign in**
3. Use your Microsoft account (Outlook, Hotmail, or work account)
4. If you don't have one, create a free Microsoft account
5. Complete the Azure sign-up (no credit card required for free tier)

**✅ You're done when**: You can access the Azure Portal dashboard

**💡 Note**: You need access to an organization's Teams data. If using a personal account, you may need to be added to an organization first.

### 1.4 Gmail Account
**Purpose**: Send notification emails when Teams messages are missed

1. Go to [Gmail](https://accounts.google.com/signup)
2. If you don't have a Gmail account, create one
3. If you already have Gmail, you can use your existing account

**✅ You're done when**: You can log in to Gmail

---

## Step 2: Fork/Clone the Repository

Choose one option based on your needs:

### Option A: Fork the Repository (Recommended for Vercel)
**Best for**: When you want to deploy to Vercel and make your own modifications

1. Go to the repository on GitHub: `https://github.com/vrundpatel1backup/Testing-AI`
2. Click the **Fork** button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for GitHub to create your fork
5. You now have your own copy at: `https://github.com/YOUR-USERNAME/Testing-AI`

**Why fork?** Vercel works best with your own GitHub repository. This lets you make changes and redeploy easily.

### Option B: Clone the Repository (For Local Development)
**Best for**: When you want to test locally first

```bash
# Clone the original repository
git clone https://github.com/vrundpatel1backup/Testing-AI.git
cd Testing-AI

# Or clone your forked repository
git clone https://github.com/YOUR-USERNAME/Testing-AI.git
cd Testing-AI

# Install dependencies
npm install
```

**Expected output**:
```
added 234 packages, and audited 235 packages in 45s

93 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**✅ You're done when**: You see the project files and `node_modules` folder

---

## Step 3: Configure Microsoft Teams (Azure AD)

This section walks you through setting up Microsoft Graph API access to read Teams messages.

### 3.1 Create an App Registration

1. **Open Azure Portal**: Go to [Azure Portal](https://portal.azure.com)
2. **Navigate to App Registrations**:
   - Click the menu icon (≡) in the top-left
   - Search for "App registrations" or find it under **Azure Active Directory**
   - Click **App registrations**

3. **Create New Registration**:
   - Click **+ New registration**
   - Fill in the form:
     - **Name**: `Teams Gmail Notifier`
     - **Supported account types**: Select `Accounts in this organizational directory only`
     - **Redirect URI**: 
       - Platform: Select `Web`
       - URL: `http://localhost:3000/api/auth/callback` (for local testing)
       - **Note**: You'll update this later with your Vercel URL
   - Click **Register**

**Screenshot guide**:
```
Azure Portal → Azure Active Directory → App registrations → + New registration

Form fields:
┌─────────────────────────────────────────┐
│ Name: Teams Gmail Notifier              │
│ Supported account types:                 │
│  ● Accounts in this organizational       │
│    directory only (Single tenant)        │
│ Redirect URI (optional):                 │
│  [Web ▼] http://localhost:3000/api/...  │
└─────────────────────────────────────────┘
       [Register Button]
```

### 3.2 Copy Important Values

After registration, you'll see the app overview page. **Copy these values** (you'll need them later):

1. **Application (client) ID**: A UUID like `12345678-1234-1234-1234-123456789abc`
2. **Directory (tenant) ID**: A UUID like `87654321-4321-4321-4321-cba987654321`

**💡 Tip**: Keep a text file open to paste these values temporarily. You'll add them to your environment variables soon.

**Where to find them**:
```
Overview page:
┌──────────────────────────────────────────┐
│ Application (client) ID: [copy icon]     │
│ 12345678-1234-1234-1234-123456789abc     │
│                                           │
│ Directory (tenant) ID: [copy icon]       │
│ 87654321-4321-4321-4321-cba987654321     │
└──────────────────────────────────────────┘
```

### 3.3 Create a Client Secret

1. In your app registration, click **Certificates & secrets** (left menu)
2. Click **+ New client secret**
3. Fill in:
   - **Description**: `Teams Notifier Secret`
   - **Expires**: Select `24 months` (recommended) or your preference
4. Click **Add**
5. **IMPORTANT**: **Copy the secret VALUE immediately** (not the Secret ID)
   - It looks like: `abC~1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ`
   - You'll NEVER see this again! If you lose it, you'll need to create a new one

**Screenshot guide**:
```
Certificates & secrets → Client secrets → + New client secret

After creating:
┌───────────────────────────────────────────────┐
│ Description: Teams Notifier Secret            │
│ Value: abC~1234567890aBcDe... [Copy button]  │
│ Secret ID: xyz123... (don't copy this)       │
│ Expires: 1/1/2026                             │
└───────────────────────────────────────────────┘
```

### 3.4 Set API Permissions

Now grant the app permission to read Teams messages:

1. Click **API permissions** (left menu)
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Select **Application permissions** (NOT Delegated)
5. Search and add these permissions:
   - `Chat.Read.All` - Read all chat messages
   - `Mail.Read` - Read mail in all mailboxes  
   - `User.Read.All` - Read all users' profiles
6. Click **Add permissions**
7. **CRITICAL**: Click **Grant admin consent for [Your Organization]**
   - You need admin privileges for this
   - If you don't have admin rights, ask your IT administrator

**Why these permissions?**
- `Chat.Read.All`: Reads Teams chat messages
- `Mail.Read`: Reads emails (for future features)
- `User.Read.All`: Gets user information for notifications

**Screenshot guide**:
```
API permissions → + Add a permission → Microsoft Graph → Application permissions

Search and select:
☑ Chat.Read.All
☑ Mail.Read
☑ User.Read.All

After adding, click:
[⚠ Grant admin consent for YOUR-ORG]
  
Status should show:
Chat.Read.All     ✓ Granted for YOUR-ORG
Mail.Read         ✓ Granted for YOUR-ORG  
User.Read.All     ✓ Granted for YOUR-ORG
```

**✅ You're done when**: All three permissions show "Granted for [Your Organization]" with green checkmarks

---

## Step 4: Configure Gmail for Notifications

Gmail requires special setup for third-party apps to send emails.

### 4.1 Enable 2-Step Verification

Gmail requires 2-Step Verification (2FA) before you can create App Passwords.

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click **Security** (left sidebar)
3. Under "Signing in to Google", find **2-Step Verification**
4. If not already enabled:
   - Click **2-Step Verification**
   - Click **Get Started**
   - Follow the prompts (you'll need your phone)
   - Complete the setup

**✅ You're done when**: 2-Step Verification shows as "On"

### 4.2 Generate App Password

Once 2FA is enabled, create an App Password:

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Scroll to **2-Step Verification** section
3. At the bottom, click **App passwords**
   - If you don't see this option, make sure 2FA is enabled and wait a few minutes
4. You may need to re-enter your password
5. On the App Passwords page:
   - **Select app**: Choose **Mail**
   - **Select device**: Choose **Other (Custom name)**
   - Enter name: `Teams Notifier`
6. Click **Generate**
7. **Copy the 16-character password** that appears
   - Format: `xxxx xxxx xxxx xxxx` (16 characters with spaces)
   - **For .env file, remove the spaces**: `xxxxxxxxxxxxxxxx`

**Screenshot guide**:
```
Google Account → Security → 2-Step Verification → App passwords

After generating:
┌──────────────────────────────────────────┐
│ Your App Password for Teams Notifier     │
│                                           │
│ abcd efgh ijkl mnop                       │
│                                           │
│ Enter this app password on your device   │
│ NOTE: Remove spaces when copying         │
└──────────────────────────────────────────┘
```

**💡 Important Notes**:
- You'll NEVER see this password again
- Remove spaces when adding to your `.env.local` file
- If you lose it, just generate a new one
- Each app password is unique; you can create multiple ones

**✅ You're done when**: You have a 16-character App Password saved

---

## Step 5: Set Up Environment Variables

Environment variables store your sensitive credentials. You'll set them up differently for local development vs. Vercel deployment.

### 5.1 For Local Development

1. **Navigate to your project folder**:
   ```bash
   cd Testing-AI
   ```

2. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Edit `.env.local`** with your favorite text editor:
   ```bash
   # On Windows
   notepad .env.local
   
   # On Mac/Linux
   nano .env.local
   # or
   code .env.local  # if you have VS Code
   ```

4. **Fill in your credentials** (use the values you copied earlier):

```env
# Microsoft Graph API (from Azure portal)
MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc
MICROSOFT_CLIENT_SECRET=abC~1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ
MICROSOFT_TENANT_ID=87654321-4321-4321-4321-cba987654321
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Gmail SMTP (from Gmail App Password)
GMAIL_USER=yourname@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
GMAIL_RECIPIENT=where-to-send-notifications@gmail.com

# App Configuration (you can keep these defaults)
CHECK_INTERVAL_MINUTES=15
NOTIFICATION_DELAY_SECONDS=300

# Cron Secret (generate a random string)
CRON_SECRET=your_random_secret_here_make_it_long_and_random

# NextAuth (optional - for future features)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=another_random_secret_generate_with_openssl
```

**How to generate random secrets**:
```bash
# On Mac/Linux/Git Bash:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or just use a password generator online
```

5. **Save the file**

**✅ You're done when**: Your `.env.local` file has all values filled in (no placeholders)

**💡 Security Note**: Never commit `.env.local` to Git! It's already in `.gitignore`.

---

## Step 6A: Local Development (Testing)

Test the application on your computer before deploying to Vercel.

### 6.1 Start the Development Server

```bash
npm run dev
```

**Expected output**:
```
  ▲ Next.js 15.0.8
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.3s
```

### 6.2 Open the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the **Dashboard** page

**What you'll see**:
```
┌────────────────────────────────────────┐
│  Teams Gmail Notifier                  │
├────────────────────────────────────────┤
│                                         │
│  [Dashboard]  [Contacts]  [History]    │
│  [Settings]                             │
│                                         │
│  📊 Dashboard                           │
│  Overview of notifications              │
│                                         │
│  Total Notifications: 0                 │
│  Active Contacts: 0                     │
└────────────────────────────────────────┘
```

### 6.3 Test Configuration

1. Click **Settings** in the sidebar
2. You should see input fields for Microsoft and Gmail configuration
3. The values from your `.env.local` file should be loaded automatically
4. Test by clicking on other pages: **Contacts**, **History**

**💡 Troubleshooting**: If you see errors, check the terminal where `npm run dev` is running for error messages.

### 6.4 Stop the Server

When done testing:
- Press `Ctrl+C` in the terminal to stop the server

**✅ You're done when**: The app runs without errors at `http://localhost:3000`

**💡 Note**: Local development doesn't include automatic scheduled checks. For that, you need to deploy to Vercel (next section).

---

## Step 6B: Deploy to Vercel (Production)

Now deploy your application to Vercel for 24/7 availability and automatic scheduled checks.

### Why Vercel?
- ✅ **Free hosting** (no credit card required)
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in cron jobs** for scheduled checks
- ✅ **HTTPS** by default
- ✅ **Fast global CDN**

### 6B.1 Prerequisites

Make sure you have:
- ✅ Forked the repository to your GitHub account (Step 2)
- ✅ Vercel account created (Step 1.2)
- ✅ All credentials ready (from Steps 3-5)

### 6B.2 Deploy Using Vercel Dashboard (Recommended)

1. **Log in to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account (if not already)

2. **Import Your Repository**:
   - Click **Add New...** → **Project**
   - Click **Import Git Repository**
   - Select your GitHub account if prompted
   - Find your forked repository: `YOUR-USERNAME/Testing-AI`
   - Click **Import**

**Screenshot guide**:
```
Vercel Dashboard
┌──────────────────────────────────────┐
│ Add New...  ▼                         │
│  → Project                            │
│  → Team                               │
└──────────────────────────────────────┘

Import Git Repository
┌──────────────────────────────────────┐
│ Search: YOUR-USERNAME/Testing-AI      │
│                                       │
│ ✓ YOUR-USERNAME/Testing-AI            │
│   [Import]                            │
└──────────────────────────────────────┘
```

3. **Configure Project**:
   - **Project Name**: `teams-gmail-notifier` (or your choice)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**:
   
   This is the most important step! Click **Environment Variables** to expand the section.
   
   Add each variable one by one:

   | Name | Value | Notes |
   |------|-------|-------|
   | `MICROSOFT_CLIENT_ID` | Your Azure App ID | From Step 3.2 |
   | `MICROSOFT_CLIENT_SECRET` | Your Azure Secret | From Step 3.3 |
   | `MICROSOFT_TENANT_ID` | Your Azure Tenant ID | From Step 3.2 |
   | `MICROSOFT_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/callback` | **Update after deployment!** |
   | `GMAIL_USER` | `yourname@gmail.com` | Your Gmail address |
   | `GMAIL_APP_PASSWORD` | Your 16-char password | From Step 4.2 (no spaces) |
   | `GMAIL_RECIPIENT` | `notify@example.com` | Where to send alerts |
   | `CHECK_INTERVAL_MINUTES` | `15` | How often to check (optional) |
   | `NOTIFICATION_DELAY_SECONDS` | `300` | 5 minutes delay (optional) |
   | `CRON_SECRET` | Random string | Generate with `openssl rand -base64 32` |

   **How to add each variable**:
   ```
   Click "+ Add Variable"
   ┌──────────────────────────────────────┐
   │ Name:  MICROSOFT_CLIENT_ID            │
   │ Value: 12345678-1234-1234-1234-...   │
   │ [Environment: Production ✓]          │
   └──────────────────────────────────────┘
   Click "Add"
   ```

   **💡 Tips**:
   - For `MICROSOFT_REDIRECT_URI`: Use placeholder first, update after deployment
   - For `CRON_SECRET`: Generate a strong random string
   - Don't include spaces in `GMAIL_APP_PASSWORD`
   - Make sure to click "Add" after each variable

5. **Deploy**:
   - Click **Deploy**
   - Wait 2-3 minutes for the build and deployment
   - Vercel will show build logs in real-time

**Expected output**:
```
Building...
✓ Installing dependencies
✓ Building application  
✓ Generating static pages
✓ Finalizing build

🎉 Your project has been deployed!

URL: https://teams-gmail-notifier-abc123.vercel.app
```

6. **Copy Your Vercel URL**:
   - After deployment, you'll see: `https://your-project-name-abc123.vercel.app`
   - **Copy this URL** - you'll need it in the next steps

**✅ You're done when**: You can visit your Vercel URL and see the application running

### 6B.3 Update Microsoft Redirect URI

Now that you have your Vercel URL, update Azure and Vercel:

1. **Update in Azure Portal**:
   - Go back to [Azure Portal](https://portal.azure.com)
   - Navigate to your App Registration: **App registrations** → **Teams Gmail Notifier**
   - Click **Authentication** (left menu)
   - Under "Web" Redirect URIs, click **+ Add URI**
   - Enter: `https://your-vercel-url.vercel.app/api/auth/callback`
   - Click **Save**

2. **Update in Vercel**:
   - Go to your project in Vercel Dashboard
   - Click **Settings** → **Environment Variables**
   - Find `MICROSOFT_REDIRECT_URI`
   - Click the **•••** menu → **Edit**
   - Update value to: `https://your-vercel-url.vercel.app/api/auth/callback`
   - Click **Save**
   - **Important**: After saving, click **Redeploy** button to apply changes

**Screenshot guide**:
```
Azure Portal:
Authentication → Redirect URIs → Web
┌──────────────────────────────────────┐
│ ☑ https://your-app.vercel.app/api... │
│ + Add URI                             │
└──────────────────────────────────────┘
[Save]

Vercel Dashboard:
Settings → Environment Variables
┌──────────────────────────────────────┐
│ MICROSOFT_REDIRECT_URI  [Edit] [•••] │
│ https://your-app.vercel.app/api/...  │
└──────────────────────────────────────┘
```

**✅ You're done when**: Both Azure and Vercel have the correct redirect URI with your Vercel URL

### 6B.4 Alternative: Deploy Using Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (your account)
# Link to existing project? No
# Project name? teams-gmail-notifier
# Directory? ./
# Override settings? No
```

The CLI will ask you to add environment variables. You can add them via CLI or later in the dashboard.

---

## Step 7: Configure Vercel Cron Jobs

Vercel's cron jobs enable automatic scheduled checks of Teams messages.

### 7.1 Understanding Cron Jobs

The app includes a `vercel.json` file that defines a cron job:

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

**What this means**:
- `*/15 * * * *` = Every 15 minutes
- Vercel will automatically call `/api/cron/check-messages` endpoint
- This checks for missed Teams messages and sends notifications

### 7.2 Verify Cron Job is Active

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Click "Cron Jobs"** tab (or "Settings" → "Cron Jobs")
4. You should see:
   ```
   Path: /api/cron/check-messages
   Schedule: */15 * * * *
   Status: ● Active
   ```

**Screenshot guide**:
```
Vercel Project → Cron Jobs
┌────────────────────────────────────────┐
│ Cron Jobs (1)                          │
│                                         │
│ /api/cron/check-messages                │
│ ● Active                                │
│ Schedule: Every 15 minutes              │
│ Last run: 2 minutes ago                 │
│ Status: Success                         │
└────────────────────────────────────────┘
```

### 7.3 Cron Secret Security

The `CRON_SECRET` environment variable prevents unauthorized access to your cron endpoint.

**Why it's important**:
- Without it, anyone could trigger your cron job by visiting the URL
- The secret ensures only Vercel's cron can trigger checks

**How it works**:
- Vercel passes the secret in the request headers
- Your API endpoint verifies it before processing
- If invalid, the request is rejected

### 7.4 Test the Cron Job

You can manually trigger a cron check (for testing):

1. Go to **Vercel Dashboard** → Your Project → **Cron Jobs**
2. Find your cron job
3. Click **Run now** or **Trigger** button
4. Check the **Logs** to see if it executed successfully

Alternatively, wait 15 minutes and check the logs automatically.

### 7.5 View Cron Logs

1. In Vercel Dashboard, go to your project
2. Click **Logs** tab
3. Filter by `/api/cron/check-messages`
4. You'll see:
   - When the cron runs
   - Any errors or successful checks
   - Messages found and notifications sent

**💡 Tip**: Logs are your best friend for debugging!

**✅ You're done when**: Cron job shows as "Active" and runs successfully every 15 minutes

---

## Step 8: Using the Web UI

Now that your app is deployed, let's explore the web interface!

### 8.1 Access the Application

- **Local**: `http://localhost:3000` (if running locally)
- **Production**: `https://your-app-name.vercel.app`

### 8.2 Dashboard Page

The main page shows an overview of your notification system.

**What you'll see**:
```
┌──────────────────────────────────────────────┐
│  ≡ Teams Gmail Notifier                      │
├──────────────────────────────────────────────┤
│ [Dashboard] [Contacts] [History] [Settings]  │
│                                               │
│ 📊 Dashboard                                  │
│ Overview of your notification activity        │
│                                               │
│ ┌───────────┐ ┌───────────┐ ┌──────────────┐│
│ │ 🔔        │ │ 📧        │ │ 👥           ││
│ │ Total     │ │ This Week │ │ Active       ││
│ │ Notifs: 5 │ │ Sent: 3   │ │ Contacts: 2  ││
│ └───────────┘ └───────────┘ └──────────────┘│
│                                               │
│ Quick Setup:                                  │
│ 1. Configure Settings ➜                       │
│ 2. Add Contacts ➜                             │
│ 3. Deploy to Vercel ✓                         │
└──────────────────────────────────────────────┘
```

**Features**:
- **Statistics Cards**: Shows notification counts
- **Quick Setup Guide**: Step-by-step checklist
- **Recent Activity**: Latest notifications (if any)

### 8.3 Settings Page

Configure your Microsoft Teams and Gmail credentials.

**How to use**:
1. Click **Settings** in the sidebar
2. You'll see two sections:
   - **Microsoft Graph API**: Enter your Azure credentials
   - **Gmail SMTP**: Enter your Gmail credentials

**What you'll see**:
```
⚙️ Settings
Configure Microsoft Teams and Gmail integration

┌─ Microsoft Graph API ────────────────┐
│ Client ID:     [••••••••••••••••••••] │
│ Client Secret: [••••••••••••••••••••] │
│ Tenant ID:     [••••••••••••••••••••] │
│ Redirect URI:  [••••••••••••••••••••] │
│ [💾 Save Microsoft Settings]          │
└──────────────────────────────────────┘

┌─ Gmail SMTP ──────────────────────────┐
│ Gmail Address: [••••••••••••••••••••] │
│ App Password:  [••••••••••••••••••••] │
│ Recipient:     [••••••••••••••••••••] │
│ [💾 Save Gmail Settings]              │
└──────────────────────────────────────┘
```

**💡 Note**: Currently, settings are managed via environment variables. The UI is for display/future features. To change settings, update environment variables in Vercel and redeploy.

### 8.4 Contacts Page

Manage which Teams users you want to monitor for missed messages.

**How to use**:
1. Click **Contacts** in the sidebar
2. Click **+ Add Contact** button
3. Enter the Teams user's information:
   - **Name**: Display name (e.g., "John Doe")
   - **Email**: Teams email address (e.g., "john.doe@company.com")
   - **Teams ID**: User's Microsoft Teams ID (optional)
4. Click **Save**

**What you'll see**:
```
👥 Contacts
Manage people to monitor on Teams

[+ Add Contact]

Contact List:
┌─────────────────────────────────────────┐
│ John Doe                                 │
│ john.doe@company.com                     │
│ [Edit] [Delete]                          │
├─────────────────────────────────────────┤
│ Jane Smith                               │
│ jane.smith@company.com                   │
│ [Edit] [Delete]                          │
└─────────────────────────────────────────┘
```

**Tips**:
- Add contacts you frequently message on Teams
- The system will only send notifications for messages from these contacts
- You can add/remove contacts anytime

### 8.5 History Page

View all sent notification emails and filter past alerts.

**How to use**:
1. Click **History** in the sidebar
2. Browse through past notifications
3. Use search/filter to find specific alerts
4. Export history if needed

**What you'll see**:
```
📜 Notification History
Track all sent Teams message notifications

[Search...] [Filter: All ▼] [Export]

History List:
┌──────────────────────────────────────────────┐
│ 2024-02-12 14:30                             │
│ From: John Doe (john.doe@company.com)        │
│ Message: "Hey, can you review the PR?"       │
│ Status: ✓ Sent                               │
├──────────────────────────────────────────────┤
│ 2024-02-12 09:15                             │
│ From: Jane Smith (jane.smith@company.com)    │
│ Message: "Meeting in 5 minutes"              │
│ Status: ✓ Sent                               │
└──────────────────────────────────────────────┘
```

**Features**:
- View sent date and time
- See message content and sender
- Track delivery status
- Export for records

### 8.6 Navigation

**Sidebar navigation**:
- **Dashboard** (🏠): Home page with overview
- **Contacts** (👥): Manage monitored users
- **History** (📜): View notification history  
- **Settings** (⚙️): Configure credentials

**Mobile-friendly**: The UI adapts to smaller screens with a collapsible menu.

**✅ You're done when**: You can navigate all pages and understand each section

---

## Local vs Cloud Deployment

Understanding the differences helps you choose the right approach:

### Local Development

**Best for**: 
- Testing configuration before deploying
- Development and debugging
- Making code changes

**Pros**:
- ✅ Fast iteration (see changes immediately)
- ✅ Full control over environment
- ✅ Easy debugging with console logs
- ✅ No deployment wait time

**Cons**:
- ❌ No automatic scheduled checks (no cron jobs)
- ❌ Not accessible from internet
- ❌ Computer must be running 24/7 for monitoring
- ❌ No HTTPS (http://localhost only)

**When to use**:
- First-time setup and testing
- Verifying credentials work correctly
- Testing UI changes
- Debugging issues

**How to run**:
```bash
npm run dev
# Access at http://localhost:3000
```

### Vercel Cloud Deployment (Production)

**Best for**:
- 24/7 automated monitoring
- Production use
- Sharing with others

**Pros**:
- ✅ **Automatic scheduled checks** via cron jobs (main advantage!)
- ✅ Always online (no need to keep computer running)
- ✅ HTTPS by default (secure)
- ✅ Free hosting (Hobby tier includes cron)
- ✅ Automatic deployments from GitHub
- ✅ Fast global CDN
- ✅ Accessible from anywhere

**Cons**:
- ❌ Deployment takes 2-3 minutes
- ❌ Must redeploy to see changes
- ❌ Debugging requires checking Vercel logs

**When to use**:
- After local testing is successful
- When you want automatic 24/7 monitoring
- Production environment

**How to deploy**:
- Push to GitHub → Vercel auto-deploys
- Or use Vercel CLI: `vercel --prod`

### Comparison Table

| Feature | Local Development | Vercel Cloud |
|---------|-------------------|--------------|
| **Cron Jobs** | ❌ No (manual testing) | ✅ Yes (automatic) |
| **24/7 Online** | ❌ No (computer must run) | ✅ Yes (always on) |
| **HTTPS** | ❌ No (http only) | ✅ Yes (automatic) |
| **Cost** | ✅ Free | ✅ Free (Hobby tier) |
| **Fast Changes** | ✅ Instant | ❌ 2-3 min deploy |
| **Debugging** | ✅ Easy (console) | ⚠️ Use logs |
| **Internet Access** | ❌ Localhost only | ✅ Public URL |
| **Recommended For** | Testing | Production |

### Recommended Workflow

1. **Start Local**: Test everything locally first
2. **Deploy to Vercel**: Once working, deploy for 24/7 monitoring
3. **Iterate**: Make changes locally, push to GitHub, auto-deploys to Vercel

**💡 Best Practice**: 
- Use local development for initial setup and testing
- Use Vercel deployment for actual automated monitoring
- Keep local environment for debugging and development

---

## Troubleshooting Guide

Common issues and solutions for first-time deployment:

### Installation Issues

#### Problem: `npm install` fails
**Symptoms**: Errors during package installation

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, check Node.js version
node --version  # Should be 18.x or higher

# Update Node.js if needed
# Visit: https://nodejs.org/
```

#### Problem: `npm run dev` fails
**Symptoms**: Server won't start

**Solutions**:
1. Check if port 3000 is already in use:
   ```bash
   # On Mac/Linux
   lsof -i :3000
   
   # On Windows
   netstat -ano | findstr :3000
   ```

2. Use a different port:
   ```bash
   PORT=3001 npm run dev
   ```

3. Check for syntax errors in your code
4. Verify `.env.local` exists and is formatted correctly

### Microsoft Graph API Issues

#### Problem: "401 Unauthorized" error
**Symptoms**: Can't access Teams data

**Solutions**:
1. ✅ Verify Client ID, Secret, and Tenant ID are correct
2. ✅ Check that Client Secret hasn't expired
3. ✅ Ensure you copied the **Value**, not the Secret ID
4. ✅ No extra spaces or line breaks in environment variables

**How to verify**:
```bash
# Print first few characters of your credentials (safe to share)
echo $MICROSOFT_CLIENT_ID | cut -c1-8
# Should show something like: 12345678

# Check if variables are set
env | grep MICROSOFT
```

#### Problem: "403 Forbidden" error
**Symptoms**: Access denied to Teams API

**Solutions**:
1. ✅ Grant admin consent for API permissions
2. ✅ Verify these permissions are granted:
   - `Chat.Read.All`
   - `Mail.Read`
   - `User.Read.All`
3. ✅ Check your Azure account has access to Teams data
4. ✅ If using personal account, you may need organization access

**How to check**:
- Go to Azure Portal → Your App → API Permissions
- All permissions should show green ✓ "Granted for [Organization]"

#### Problem: "No messages returned" 
**Symptoms**: Cron job runs but finds no messages

**Solutions**:
1. ✅ Verify the user account has Teams messages
2. ✅ Check if messages are recent (within notification delay window)
3. ✅ Ensure contacts are added and have their Teams email correct
4. ✅ Check Vercel logs for detailed error messages

### Gmail SMTP Issues

#### Problem: "535 Authentication Failed"
**Symptoms**: Can't send emails via Gmail

**Solutions**:
1. ✅ Verify Gmail App Password is correct
2. ✅ Remove all spaces from the 16-character password
3. ✅ Ensure 2-Step Verification is enabled on Gmail
4. ✅ Try generating a new App Password
5. ✅ Check if "Less secure app access" is disabled (it should be, use App Passwords instead)

**Example**:
```env
# WRONG (with spaces)
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# CORRECT (no spaces)
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

#### Problem: "Connection timeout"
**Symptoms**: Gmail SMTP connection fails

**Solutions**:
1. ✅ Check firewall isn't blocking port 587 or 465
2. ✅ Verify your internet connection
3. ✅ Try using alternate SMTP ports (587 vs 465)
4. ✅ Check Gmail isn't temporarily blocking your access

### Vercel Deployment Issues

#### Problem: Build fails on Vercel
**Symptoms**: Deployment error during build

**Solutions**:
1. ✅ Check build logs in Vercel dashboard
2. ✅ Ensure code builds locally first: `npm run build`
3. ✅ Verify all dependencies are in `package.json`
4. ✅ Check TypeScript errors: `npm run lint`

**Common build errors**:
```bash
# Test build locally first
npm run build

# If TypeScript errors:
npm run lint

# If missing dependencies:
npm install

# If version mismatch:
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Environment variables not working on Vercel
**Symptoms**: App works locally but fails on Vercel

**Solutions**:
1. ✅ Verify all environment variables are added in Vercel dashboard
2. ✅ Check variable names match exactly (case-sensitive)
3. ✅ No extra spaces in values
4. ✅ **Redeploy** after adding/changing variables
5. ✅ Make sure variables are in "Production" environment

**How to verify**:
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Count: Should have ~10-11 variables
- Check each one for typos

#### Problem: Redirect URI mismatch
**Symptoms**: Authentication errors after deployment

**Solutions**:
1. ✅ Update Azure Redirect URI with your actual Vercel URL
2. ✅ Update `MICROSOFT_REDIRECT_URI` in Vercel environment variables
3. ✅ **Redeploy** after changing
4. ✅ Format should be: `https://your-app.vercel.app/api/auth/callback`

**Common mistakes**:
```
❌ http://your-app.vercel.app/...  (should be https)
❌ https://your-app.vercel.app     (missing /api/auth/callback)
❌ http://localhost:3000/...       (forgot to update from local)
```

### Vercel Cron Issues

#### Problem: Cron job not running
**Symptoms**: No automatic checks happening

**Solutions**:
1. ✅ **Verify you're on Hobby plan or higher** (Free Hobby plan includes cron)
2. ✅ Check `vercel.json` exists and is properly formatted
3. ✅ View logs: Vercel Dashboard → Logs → Filter by `/api/cron`
4. ✅ Cron tab shows "Active" status

**How to check plan**:
- Vercel Dashboard → Settings → General → Plan
- Should show "Hobby" or higher (not "Free")

#### Problem: "401 Unauthorized" on cron endpoint
**Symptoms**: Cron runs but gets rejected

**Solutions**:
1. ✅ Verify `CRON_SECRET` is set in Vercel environment variables
2. ✅ Make sure secret matches what's in your code
3. ✅ Check the secret has no extra spaces or line breaks

#### Problem: Cron runs but no notifications sent
**Symptoms**: Cron executes successfully but no emails

**Solutions**:
1. ✅ Check contacts are added
2. ✅ Verify Teams messages exist from those contacts
3. ✅ Ensure messages are unread and past the notification delay (default 5 min)
4. ✅ Check Gmail credentials are correct
5. ✅ Review Vercel logs for detailed error messages

**Debugging**:
```bash
# In Vercel logs, look for:
"Checking for missed messages..."
"Found X unread messages"
"Sent notification for message from..."
"No missed messages found"
```

### First-Time Deployment Checklist

If nothing works, verify each step:

- [ ] **Accounts Created**:
  - [ ] GitHub account
  - [ ] Vercel account  
  - [ ] Azure account
  - [ ] Gmail account with 2FA

- [ ] **Azure Setup**:
  - [ ] App registration created
  - [ ] Client ID copied
  - [ ] Client Secret copied (the Value, not ID)
  - [ ] Tenant ID copied
  - [ ] API permissions granted (3 permissions)
  - [ ] Admin consent granted (green checkmarks)

- [ ] **Gmail Setup**:
  - [ ] 2-Step Verification enabled
  - [ ] App Password generated
  - [ ] Password copied without spaces

- [ ] **Repository**:
  - [ ] Forked to your GitHub account
  - [ ] Or cloned locally

- [ ] **Environment Variables**:
  - [ ] All 10+ variables added in Vercel
  - [ ] No typos in variable names
  - [ ] No extra spaces in values
  - [ ] `MICROSOFT_REDIRECT_URI` uses your Vercel URL

- [ ] **Deployment**:
  - [ ] Deployed to Vercel successfully
  - [ ] App accessible via Vercel URL
  - [ ] Redirect URI updated in Azure
  - [ ] Redeployed after URI update

- [ ] **Cron Job**:
  - [ ] `vercel.json` exists
  - [ ] Cron shows as "Active" in Vercel
  - [ ] `CRON_SECRET` is set

### Getting Help

If you're still stuck:

1. **Check Vercel Logs**: Most issues show up here
   - Vercel Dashboard → Your Project → Logs
   - Filter by error or time range

2. **Check Azure Logs**: For Teams API issues
   - Azure Portal → Your App → Monitoring → Logs

3. **Test Locally First**: Easier to debug
   ```bash
   npm run dev
   # Check terminal for errors
   ```

4. **Review Documentation**:
   - [Microsoft Graph Docs](https://docs.microsoft.com/graph/)
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

5. **Search Error Messages**: Copy exact error and search online

6. **Ask for Help**:
   - Open an issue on GitHub repository
   - Include: error message, what you tried, logs

**💡 Pro Tip**: Take screenshots of your configuration screens (hiding sensitive values). This helps when asking for help!

---

## Advanced Configuration

### Adjusting Check Frequency

You can customize how often the app checks for missed messages:

**Edit `vercel.json`**:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-messages",
      "schedule": "*/5 * * * *"     // Every 5 minutes
      // or
      "schedule": "0 * * * *"        // Every hour
      // or  
      "schedule": "0 9-17 * * 1-5"   // Every hour, 9am-5pm, weekdays only
    }
  ]
}
```

**Cron Schedule Format**:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-6, Sunday=0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples**:
- `*/15 * * * *` - Every 15 minutes (default)
- `*/5 * * * *` - Every 5 minutes (more frequent)
- `0 * * * *` - Every hour on the hour
- `0 */2 * * *` - Every 2 hours
- `0 9-17 * * 1-5` - Every hour from 9am-5pm, Monday-Friday
- `0 9,12,15 * * *` - At 9am, 12pm, and 3pm every day

**⚠️ Important**: After editing, commit and push to GitHub. Vercel will auto-deploy and update the cron schedule.

### Adjusting Notification Delay

Control how long a message must be unread before triggering a notification:

**Update environment variable in Vercel**:
```env
NOTIFICATION_DELAY_SECONDS=300   # 5 minutes (default)
NOTIFICATION_DELAY_SECONDS=600   # 10 minutes
NOTIFICATION_DELAY_SECONDS=180   # 3 minutes
```

This prevents notifications for messages you might have just received but haven't read yet.

### Customizing the UI

The app uses Tailwind CSS and shadcn/ui components.

**Change Colors**:
Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(222.2 47.4% 11.2%)",  // Change these
        foreground: "hsl(210 40% 98%)",
      },
    },
  },
}
```

**Modify Components**:
- UI components are in `/components/ui/`
- Page layouts are in `/app/*/page.tsx`
- Sidebar navigation is in `/components/sidebar.tsx`

### Multiple Environment Setup

**Development, Staging, Production**:

1. In Vercel, you can create separate deployments for different branches
2. Go to Settings → Git → Production Branch
3. Set up environment variables per environment

**Example**:
- `main` branch → Production (sends real emails)
- `staging` branch → Staging (test emails to yourself)
- Local → Development (no automated checks)

---

## Security Best Practices

### Protecting Your Credentials

- ✅ **Never commit** `.env.local` or `config/config.json` to Git (already in `.gitignore`)
- ✅ **Use environment variables** for all secrets in Vercel
- ✅ **Rotate secrets regularly**: Change Client Secrets and App Passwords every 6-12 months
- ✅ **Use minimum permissions**: Only grant the API permissions you need
- ✅ **Enable cron secret verification**: Prevents unauthorized cron triggers
- ✅ **Monitor access logs**: Check Vercel logs regularly for unusual activity

### Credential Management

**Setting expiration reminders**:
1. Azure Client Secrets: Set calendar reminder before expiration
2. Gmail App Passwords: Can be regenerated anytime
3. Regular audit: Review who has access to your Azure app

**If credentials are compromised**:
1. **Immediately** regenerate Azure Client Secret
2. Generate new Gmail App Password  
3. Update environment variables in Vercel
4. Redeploy application
5. Review logs for unauthorized access

### API Rate Limits

**Microsoft Graph API**:
- Free tier has rate limits (typically 120 requests/minute)
- Don't set cron frequency too high (every 5 minutes is reasonable)
- Monitor for 429 "Too Many Requests" errors in logs

**Gmail SMTP**:
- Google limits outgoing emails (~500/day for free accounts)
- If you hit limits, consider reducing check frequency
- Or use a dedicated notification email service

---

## Project Structure

Understanding the codebase structure:

```
Testing-AI/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── callback/         # OAuth callback handler
│   │   └── cron/
│   │       └── check-messages/   # Cron job endpoint (runs every 15 min)
│   ├── contacts/                 # Contacts management page
│   │   └── page.tsx
│   ├── history/                  # Notification history page
│   │   └── page.tsx
│   ├── settings/                 # Settings/configuration page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout with sidebar navigation
│   ├── page.tsx                  # Dashboard/home page
│   └── globals.css               # Global styles and Tailwind
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Card, etc.)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── sidebar.tsx               # Navigation sidebar component
├── lib/
│   ├── gmail.ts                  # Gmail/Nodemailer email utilities
│   ├── msgraph.ts                # Microsoft Graph API client
│   └── utils.ts                  # Helper functions (cn, etc.)
├── config/
│   └── config.json               # JSON storage for contacts & history
│                                 # (gitignored, created at runtime)
├── .env.example                  # Template for environment variables
├── .env.local                    # Your actual credentials (gitignored)
├── vercel.json                   # Vercel configuration (cron jobs)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file!
```

**Key Files**:

- **`/app/api/cron/check-messages/route.ts`**: 
  - Main cron job logic
  - Checks Teams for missed messages
  - Sends email notifications
  - Triggered by Vercel cron every 15 minutes

- **`/lib/msgraph.ts`**: 
  - Microsoft Graph API integration
  - Authenticates with Azure AD
  - Fetches Teams messages

- **`/lib/gmail.ts`**: 
  - Gmail SMTP integration
  - Sends notification emails via Nodemailer

- **`/components/sidebar.tsx`**: 
  - Navigation menu
  - Links to Dashboard, Contacts, History, Settings

- **`vercel.json`**: 
  - Defines cron job schedule
  - Configuration for Vercel deployment

---

## How It Works

Understanding the notification flow:

### 1. Scheduled Check (Every 15 Minutes)
```
Vercel Cron → Triggers → /api/cron/check-messages
```
- Vercel's cron service automatically calls the endpoint
- Runs in the background on a schedule
- No user interaction needed

### 2. Authentication & Fetch
```
API Endpoint → Microsoft Graph API → Teams Messages
```
- Uses your Azure credentials to authenticate
- Calls Microsoft Graph to get unread Teams messages
- Filters messages from your monitored contacts

### 3. Filter & Analyze
```
Unread Messages → Check Timestamp → Identify "Missed" Messages
```
- For each unread message, check how long it's been unread
- If unread for > 5 minutes (configurable), it's considered "missed"
- Prevents notifications for very recent messages

### 4. Send Notification
```
Missed Message → Gmail SMTP → Email Notification
```
- Formats a notification email with message details
- Sends via Gmail using Nodemailer
- Email includes: sender name, message preview, timestamp

### 5. Log History
```
Sent Notification → Save to config.json → Display in History
```
- Records the notification in JSON storage
- Tracks: timestamp, sender, message, status
- Viewable in the History page of the UI

### Flow Diagram

```
┌─────────────┐
│ Vercel Cron │ Every 15 minutes
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ /api/cron/check-messages │ Verify CRON_SECRET
└──────┬───────────────────┘
       │
       ▼
┌─────────────────────┐
│ Microsoft Graph API │ Authenticate & fetch unread messages
└──────┬──────────────┘
       │
       ▼
┌───────────────────┐
│ Filter by         │ Only messages from monitored contacts
│ Contacts          │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ Check Timestamp   │ Unread > 5 minutes = "Missed"
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ Send Email        │ Via Gmail SMTP
│ Notification      │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ Log to History    │ Save in config.json
└───────────────────┘
```

### Example Scenario

**Situation**: You're in a meeting and miss a Teams message from your boss.

1. **11:00 AM**: Boss sends you a Teams message: "Can you join the standup?"
2. **11:03 AM**: Message still unread (you're in a meeting)
3. **11:05 AM**: Still unread, now past the 5-minute threshold
4. **11:15 AM**: Vercel cron runs the check
5. **11:15 AM**: System detects the message has been unread for 15 minutes
6. **11:15 AM**: Email notification sent to your Gmail: "Missed Teams message from Boss: 'Can you join the standup?'"
7. **11:16 AM**: You check your email and see the notification
8. **11:17 AM**: You respond to the Teams message

**Result**: You didn't miss the important message even though you were busy!

---

## FAQ (Frequently Asked Questions)

### General Questions

**Q: Is this really free?**  
A: Yes! All services used (Vercel, Azure free tier, Gmail) are free for personal use.

**Q: Do I need a credit card?**  
A: No credit card required for Vercel Hobby plan, Azure free tier, or Gmail.

**Q: Can I use this for my organization?**  
A: Yes, but you'll need appropriate Microsoft 365 licenses and Azure AD admin consent.

**Q: How many contacts can I monitor?**  
A: No hard limit, but recommended to keep it under 20-30 for better performance.

**Q: Will this work with personal Microsoft accounts?**  
A: It works best with organizational Microsoft 365 accounts. Personal accounts may have limitations.

### Technical Questions

**Q: Can I change the notification frequency?**  
A: Yes! Edit the `schedule` in `vercel.json`. See [Advanced Configuration](#advanced-configuration).

**Q: Can I send notifications to multiple email addresses?**  
A: Currently supports one recipient. You could modify the code to add multiple recipients.

**Q: Does this work with Microsoft Teams for personal use?**  
A: It's designed for Microsoft 365 Teams. Personal Teams has limited API access.

**Q: Can I deploy to services other than Vercel?**  
A: Yes, but you'll need to set up cron jobs differently. Vercel makes it easiest.

**Q: How do I backup my data?**  
A: The `config.json` file stores contacts and history. Download it from Vercel or export from the UI.

**Q: Can I use a different email provider instead of Gmail?**  
A: Yes, modify `/lib/gmail.ts` to use any SMTP service (SendGrid, Mailgun, etc.).

### Privacy & Security Questions

**Q: Who can see my Teams messages?**  
A: Only you (via the Azure app you created). Messages are not stored or shared.

**Q: Is my data stored anywhere?**  
A: Minimal data (contacts, notification history) is stored in `config.json` on Vercel.

**Q: Can others access my deployed app?**  
A: Yes, anyone with the URL can view it. Add authentication if you want to restrict access.

**Q: What happens if my credentials are leaked?**  
A: Immediately regenerate Azure Client Secret and Gmail App Password. See [Security Best Practices](#security-best-practices).

**Q: Does this comply with my organization's policies?**  
A: Check with your IT department before deploying for work use.

### Troubleshooting Questions

**Q: Why am I not receiving notifications?**  
A: Check: 1) Contacts are added, 2) Gmail credentials correct, 3) Messages are truly unread for >5 minutes, 4) Check Vercel logs.

**Q: The cron job isn't running. Why?**  
A: Verify you're on Vercel Hobby plan (not legacy Free plan). Check Cron Jobs tab in Vercel dashboard.

**Q: I'm getting 401 errors. What's wrong?**  
A: Your Azure credentials are incorrect or expired. Double-check Client ID, Secret, and Tenant ID.

**Q: Can I test the cron job without waiting 15 minutes?**  
A: Yes! In Vercel dashboard, go to Cron Jobs and click "Run now" button.

---

## Additional Resources

### Official Documentation

- **Microsoft Graph API**: [https://docs.microsoft.com/graph/](https://docs.microsoft.com/graph/)
- **Vercel Cron Jobs**: [https://vercel.com/docs/cron-jobs](https://vercel.com/docs/cron-jobs)
- **Next.js 14**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Nodemailer**: [https://nodemailer.com/](https://nodemailer.com/)
- **Gmail SMTP**: [https://support.google.com/mail/answer/7126229](https://support.google.com/mail/answer/7126229)
- **Azure AD**: [https://docs.microsoft.com/azure/active-directory/](https://docs.microsoft.com/azure/active-directory/)

### Tutorials & Guides

- **Cron Expression Generator**: [https://crontab.guru/](https://crontab.guru/)
- **Next.js App Router Guide**: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- **Microsoft Graph Explorer**: [https://developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer) (test API calls)
- **Vercel Environment Variables**: [https://vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Tools

- **OpenSSL** (for generating secrets):
  ```bash
  openssl rand -base64 32
  ```
- **Graph Explorer** (test Graph API): [https://developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer)
- **JWT Debugger** (decode tokens): [https://jwt.io/](https://jwt.io/)

### Community & Support

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share tips
- **Stack Overflow**: Search for `microsoft-graph`, `vercel`, `nextjs` tags

---

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

1. Check if the issue already exists
2. Provide detailed description
3. Include:
   - Environment (local/Vercel)
   - Error messages (hide sensitive data)
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Enhancements

1. Open an issue with the "enhancement" label
2. Describe the feature and use case
3. Explain why it would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly (local + Vercel)
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

**Code Style**:
- Use TypeScript
- Follow existing patterns
- Add comments for complex logic
- Test before submitting

---

## Changelog

### v0.1.0 (Current)
- ✅ Initial release
- ✅ Microsoft Teams integration via Graph API
- ✅ Gmail SMTP notifications
- ✅ Contact management
- ✅ Notification history
- ✅ Vercel deployment with cron jobs
- ✅ Dashboard UI
- ✅ Settings page

### Roadmap (Future)
- 🔮 Multiple recipient support
- 🔮 Slack/Discord integration
- 🔮 Custom notification templates
- 🔮 Advanced filtering rules
- 🔮 Mobile app
- 🔮 Database support (PostgreSQL/MongoDB)
- 🔮 User authentication
- 🔮 Multi-tenant support
- 🔮 Analytics dashboard

---

## License

**MIT License**

Copyright (c) 2024 Teams Gmail Notifier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Acknowledgments

Built with these amazing technologies:

- [Next.js](https://nextjs.org/) - The React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Microsoft Graph](https://developer.microsoft.com/graph) - Microsoft 365 API
- [Nodemailer](https://nodemailer.com/) - Email sending library
- [Vercel](https://vercel.com/) - Deployment platform
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

Special thanks to all contributors and users!

---

## Support

### Getting Help

If you need assistance:

1. **Check this README**: Most questions are answered here
2. **Review Troubleshooting**: See [Troubleshooting Guide](#troubleshooting-guide)
3. **Search Issues**: Someone may have had the same problem
4. **Check Logs**: Vercel logs provide detailed error information
5. **Ask Questions**: Open a GitHub Discussion

### Reporting Security Issues

If you discover a security vulnerability:

- **Do NOT** open a public issue
- Email directly to the repository maintainer
- Provide details: what, where, how to reproduce
- Allow time for a fix before public disclosure

### Commercial Support

For enterprise deployments or custom development:

- Contact via GitHub Issues for consulting inquiries
- Dedicated support contracts available
- Custom feature development
- Training and onboarding sessions

---

## Final Notes

### Success Tips

✅ **Test locally first** - Always verify configuration works before deploying  
✅ **Check logs regularly** - Catch issues early by monitoring Vercel logs  
✅ **Start simple** - Begin with 1-2 contacts, expand as you get comfortable  
✅ **Keep credentials safe** - Never share or commit your secrets  
✅ **Update regularly** - Keep dependencies and credentials up to date  

### Common Beginner Mistakes

❌ **Forgetting to grant admin consent** in Azure (Step 3.4)  
❌ **Including spaces** in Gmail App Password (Step 4.2)  
❌ **Not updating redirect URI** after deployment (Step 6B.3)  
❌ **Missing CRON_SECRET** environment variable (Step 7.3)  
❌ **Not redeploying** after changing environment variables  

### What's Next?

After successful deployment:

1. ✅ **Add your contacts** - Start with 1-2 people you message frequently
2. ✅ **Monitor the logs** - Watch for successful checks and notifications
3. ✅ **Customize settings** - Adjust frequency and delay to your needs
4. ✅ **Test notifications** - Have someone send you a Teams message and verify the email
5. ✅ **Share feedback** - Let us know how it's working for you!

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**

*Last updated: February 2024*

---

Need help? Have questions? [Open an issue](https://github.com/vrundpatel1backup/Testing-AI/issues) on GitHub!

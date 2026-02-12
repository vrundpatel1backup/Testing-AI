import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure Microsoft Teams and Gmail integration
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Microsoft Graph API</CardTitle>
            <CardDescription>
              Configure Microsoft Teams authentication and API access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client ID</label>
              <Input placeholder="Your Azure AD Application Client ID" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Secret</label>
              <Input type="password" placeholder="Your Azure AD Application Client Secret" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tenant ID</label>
              <Input placeholder="Your Azure AD Tenant ID" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Redirect URI</label>
              <Input placeholder="https://your-app.vercel.app/api/auth/callback" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Microsoft Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gmail SMTP</CardTitle>
            <CardDescription>
              Configure Gmail for sending notification emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gmail Address</label>
              <Input type="email" placeholder="your-email@gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">App Password</label>
              <Input type="password" placeholder="Your Gmail App Password (16 characters)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Email</label>
              <Input type="email" placeholder="where-to-send@example.com" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Gmail Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Check Interval (minutes)</label>
              <Input type="number" placeholder="15" defaultValue="15" />
              <p className="text-xs text-muted-foreground">
                How often to check for missed messages (minimum: 5 minutes)
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Delay (seconds)</label>
              <Input type="number" placeholder="300" defaultValue="300" />
              <p className="text-xs text-muted-foreground">
                Wait time before considering a message "missed" (default: 5 minutes)
              </p>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-2">
            Manage people you want to monitor on Microsoft Teams
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>
            People you're monitoring for missed Teams messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input placeholder="Search contacts..." />
            </div>
            <div className="rounded-lg border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No contacts added yet. Click "Add Contact" to get started.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding contact monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            When you add a contact, the system will:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Monitor their Microsoft Teams messages to you</li>
            <li>Check for unread or missed messages periodically</li>
            <li>Send you email notifications via Gmail when messages are detected</li>
            <li>Track notification history for your reference</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

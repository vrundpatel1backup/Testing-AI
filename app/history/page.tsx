import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification History</h1>
          <p className="text-muted-foreground mt-2">
            View all sent notifications and missed message alerts
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            All notifications sent in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input placeholder="Search history..." />
            </div>
            <div className="rounded-lg border">
              <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div>Date & Time</div>
                <div>Contact</div>
                <div>Message Preview</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No notification history available yet.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>
            Overview of your notification activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

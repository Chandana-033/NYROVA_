import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings · Nyrova" }] }),
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Organization, security, and notification preferences." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="text-base">Organization</CardTitle><CardDescription>Hospital profile</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Hospital name</Label><Input defaultValue="St. Mary's Medical Center" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Admin email</Label><Input defaultValue="admin@stmarys.health" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Timezone</Label><Input defaultValue="America/New_York" /></div>
            <Button className="gradient-primary text-white">Save</Button>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle><CardDescription>How you get alerted</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Critical alerts (email)", true],
              ["Critical alerts (SMS)", true],
              ["Daily summary email", true],
              ["Weekly fairness digest", false],
              ["Product updates", false],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between">
                <Label className="text-sm">{l as string}</Label>
                <Switch defaultChecked={v as boolean} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

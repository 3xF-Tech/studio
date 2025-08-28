
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

function SettingsPage() {
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Configuration</CardTitle>
          <CardDescription>
            Manage the knowledge base and behavior of your virtual assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="knowledge-base">Knowledge Base</Label>
            <Textarea
              id="knowledge-base"
              placeholder="Add information about procedures, contraindications, and patient profiles here. The AI will use this to qualify leads."
              className="min-h-[250px]"
              defaultValue="For Botox, patients should not be pregnant or have neurological diseases. Ideal candidates are seeking to reduce fine lines. Common side effects include temporary bruising."
            />
             <p className="text-sm text-muted-foreground">
              This information is used by the lead qualification agent.
            </p>
          </div>
          <Button>Save Changes</Button>
          <Separator />
           <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Confirm appointments 72 hours prior</p>
                    <p className="text-sm text-muted-foreground">Automatically send WhatsApp reminders.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Enforce 48-hour cancellation policy</p>
                    <p className="text-sm text-muted-foreground">Notify clients of charges for late cancellations.</p>
                </div>
                <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and notification preferences.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="new-messages">New Messages</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new messages in chat rooms.
              </p>
            </div>
            <Switch id="new-messages" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="friend-requests">Friend Requests</Label>
               <p className="text-sm text-muted-foreground">
                Get notified when someone sends you a friend request.
              </p>
            </div>
            <Switch id="friend-requests" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="room-invites">Room Invites</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you are invited to a private room.
              </p>
            </div>
            <Switch id="room-invites" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Account</CardTitle>
          <CardDescription>
            Update your account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Alina" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="alina@example.com" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="destructive">Delete My Account</Button>
        </CardContent>
       </Card>
    </div>
  );
}

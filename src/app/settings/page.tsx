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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, User, Shield, CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/mock-data';

export default function SettingsPage() {
  const currentUser = getCurrentUser();

  return (
    <div className="space-y-6">
      <header className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold font-headline">{currentUser.name}</h1>
          <p className="text-sm text-muted-foreground">ID: {currentUser.id}</p>
        </div>
      </header>
      <Separator />
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="account">
            <User className="mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Account Information</CardTitle>
              <CardDescription>
                Update your public profile and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={currentUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alina@example.com" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue={currentUser.bio} />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
           <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                    <div>
                        <h3 className="font-semibold">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data.
                        </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-semibold">Log Out</h3>
                        <p className="text-sm text-muted-foreground">
                            You will be returned to the login screen.
                        </p>
                    </div>
                    <Button variant="outline">Log Out</Button>
                </div>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="notifications">
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
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="live-alerts">Go-Live Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a friend starts a live broadcast.
                  </p>
                </div>
                <Switch id="live-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="privacy">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Privacy Settings</CardTitle>
                    <CardDescription>Manage who can see your information and contact you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                        <Label htmlFor="show-online">Show Online Status</Label>
                        <p className="text-sm text-muted-foreground">
                            Let others see when you are active on the app.
                        </p>
                        </div>
                        <Switch id="show-online" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                        <Label htmlFor="private-profile">Private Profile</Label>
                        <p className="text-sm text-muted-foreground">
                            If enabled, only your friends can see your full profile.
                        </p>
                        </div>
                        <Switch id="private-profile" />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="billing">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Billing & Subscriptions</CardTitle>
                    <CardDescription>Manage your payment methods and subscriptions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-6 text-center border rounded-lg">
                        <p className="text-muted-foreground">No active subscriptions.</p>
                        <Button className="mt-4">Explore VIP Plans</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

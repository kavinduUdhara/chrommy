import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Tabcard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TbAdjustmentsHorizontal, TbUser, TbUserEdit } from "react-icons/tb";

export function SettingsPopUp({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-1 flex overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Tabs */}
        <Tabs
          defaultValue="userData"
          className="w-full flex flex-col items-center"
        >
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="userData">
              <TbUserEdit />
            </TabsTrigger>
            <TabsTrigger value="sessionData">
              <TbAdjustmentsHorizontal />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="userData">
            <Card>
              <CardHeader className="hidden">
                <CardTitle>Your Persoanl Information</CardTitle>
                <CardDescription>
                  Your information helps the chat API (Gemini Nano) deliver a
                  more personalized and seamless experience tailored to your
                  preferences. Since everything stays on your device and all
                  inputs are optional, you have full control over what you
                  share.
                </CardDescription>
              </CardHeader>
              <div className="px-2 mt-1 mb-3">
                <Alert className="bg-slate-50">
                  <TbUserEdit className="h-4 w-4" />
                  <AlertTitle>Your Personal Information</AlertTitle>
                  <AlertDescription className="text-xs">
                    Gemini Nano tailors your chat experience to your
                    preferences. All data stays offline, and sharing is
                    optional. If you experience poor-quality responses, try
                    clearing all fields and{" "}
                    <a
                      href="goo.gle/chrome-ai-dev-preview-feedback-quality"
                      target="_blank"
                      className="underline text-gray-700"
                    >
                      providing feedback.
                    </a>
                  </AlertDescription>
                </Alert>
              </div>
              <CardContent className="space-y-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="username" placeholder="Doe" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">Age</Label>
                    <Input id="firstName" placeholder="18" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Pronouns</Label>
                    <Input id="username" placeholder="He/Him" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Languge/Tone</Label>
                    <Input
                      id="username"
                      placeholder="Formal | casual | humorous | empathetic"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lastName">Topics of Interest</Label>
                  <Input
                    id="username"
                    placeholder="technology, sports, books"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Email</Label>
                  <Input id="username" placeholder="JhonDoe@google.com" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Phone No</Label>
                  <Input id="username" placeholder="+xx xxx xxxx" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Address</Label>
                  <Textarea placeholder={`x/y, \nABC Road,\nA city.`} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="sessionData">
            <Card>
              <CardHeader className="hidden">
                <CardTitle>fine tube chat session</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <div className="px-2 mt-1 mb-3">
                <Alert className="bg-slate-50">
                  <TbAdjustmentsHorizontal className="h-4 w-4" />
                  <AlertTitle>Fine-Tune Chat Behavior</AlertTitle>
                  <AlertDescription className="text-xs">
                    Adjust parameters like Temperature and Top-K to shape
                    response style and variety. For optimal performance, we
                    recommend keeping these settings at their default values.
                  </AlertDescription>
                </Alert>
              </div>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

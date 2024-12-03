import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
import { Slider } from "@/components/ui/slider";
import { TbAdjustmentsHorizontal, TbUserEdit } from "react-icons/tb";
import { initDB } from "../lib/chatHistoryDB"; // Import utility functions
import { createNewPreference, getPreferenceByID, updatePreferenceByID } from "../lib/chatHistoryDB";

export function SettingsPopUp({ children }) {
  const [preferences, setPreferences] = useState({
    firstName: "",
    lastName: "",
    age: "",
    pronouns: "",
    languageTone: "",
    topics: "",
    email: "",
    phone: "",
    address: "",
    temperature: 5,
    topK: 3,
  });

  useEffect(() => {
    console.log("Preferences updated:", preferences);
  }, [preferences]);

  // Load existing preferences
  const loadPreferences = async () => {
    const db = await initDB();
    const existingPreferences = await getPreferenceByID("userInfo");
    if (existingPreferences) {
      setPreferences(existingPreferences.data);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  // Save preferences to the database
  const savePreferences = async () => {
    const db = await initDB();
    try {
      const existing = await getPreferenceByID("userInfo");
      console.log("Updating existing preferences:", preferences);
      if (existing) {
        await updatePreferenceByID("userInfo", { data: preferences });
      } else {
        await createNewPreference("userInfo", {data: preferences} );
      }
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <Dialog onOpenChange={loadPreferences}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-1 flex overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="userData" className="w-full flex flex-col items-center">
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
              <CardContent className="space-y-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={preferences.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={preferences.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="space-y-1">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      placeholder="18"
                      value={preferences.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pronouns">Pronouns</Label>
                    <Input
                      id="pronouns"
                      placeholder="He/Him"
                      value={preferences.pronouns}
                      onChange={(e) => handleInputChange("pronouns", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="languageTone">Language/Tone</Label>
                    <Input
                      id="languageTone"
                      placeholder="Formal | Casual | Humorous | Empathetic"
                      value={preferences.languageTone}
                      onChange={(e) => handleInputChange("languageTone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="topics">Topics of Interest</Label>
                  <Input
                    id="topics"
                    placeholder="technology, sports, books"
                    value={preferences.topics}
                    onChange={(e) => handleInputChange("topics", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="john.doe@example.com"
                    value={preferences.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone No</Label>
                  <Input
                    id="phone"
                    placeholder="+xx xxx xxxx"
                    value={preferences.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="x/y, ABC Road, A city"
                    value={preferences.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setPreferences({})}>Clear All</Button>
                <Button onClick={savePreferences}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="sessionData">
            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Slider
                    defaultValue={[preferences.temperature]}
                    max={10}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => handleInputChange("temperature", value[0])}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="topK">Top K</Label>
                  <Slider
                    defaultValue={[preferences.topK]}
                    max={19}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => handleInputChange("topK", value[0])}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setPreferences({ temperature: 5, topK: 3 })}>Reset</Button>
                <Button onClick={savePreferences}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

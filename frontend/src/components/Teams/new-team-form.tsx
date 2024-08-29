import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAppStore } from "@/store/use-app-store";
import ReactFileDropZone from "../react-drop-zone";
import SelectCountryLeague from "../select-country-league";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image_url: z.string(),
  country_id: z.string(),
  league_id: z.string(),
});

export default function NewTeamForm() {
  const { addTeam, countries, leagues } = useAppStore();
  const { token } = useTokenStore();
  const [uploadedImage, setUploadedImage] = useState("");
  const [countryId, setCountryId] = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image_url: uploadedImage,
      country_id: "",
      league_id: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.image_url = uploadedImage;
    values.country_id = countryId;
    values.league_id = leagueId;
    setLoading(true);
    const resp = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify(values),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newTeam } = data;
      console.log(newTeam);
      addTeam(newTeam);
      toast({ title: "successful" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Countries */}
        <div>
          <SelectCountryLeague
            data={countries}
            name="Countries"
            setValue={setCountryId}
          />
        </div>
        {/* Leagues */}
        <div>
          <SelectCountryLeague
            data={leagues}
            name="Leagues"
            setValue={setLeagueId}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Chinese" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <ReactFileDropZone
          setUploadedImage={setUploadedImage}
          uploadedImage={uploadedImage}
        />

        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

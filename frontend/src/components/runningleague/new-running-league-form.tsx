import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAdminStore } from "@/store/use-admin-store";
import SelectCountryLeague from "../select-country-league";
import { MultipleSelect } from "../multiple-select";

const formSchema = z.object({
  league_id: z.string(),
  teamIds: z.array(z.string()),
});

export default function NewRunningLeageForm() {
  const { leagues, teams, addRunningLeague, ws } = useAdminStore();
  const { token } = useTokenStore();
  const [leagueId, setLeagueId] = useState("");
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league_id: "",
      teamIds,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!ws) return;
    values.league_id = leagueId;
    values.teamIds = teamIds;
    // console.log(values);
    setLoading(true);
    const resp = await fetch("/api/runningleagues", {
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
      const { newRunningLeague } = data;
      addRunningLeague(newRunningLeague);
      ws.send(
        JSON.stringify({
          type: "newrunningleague",
          message: newRunningLeague,
          sendTo: "client",
        })
      );
      toast({ title: "successful" });
    }
  }

  const leaguesData = leagues.map((item) => ({ id: item.id, name: item.name }));
  const teamsData = teams.map((item) => ({
    id: item.id,
    name: item.shortName,
  }));

  return (
    <div className=" max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <SelectCountryLeague
              data={leaguesData}
              name="League"
              setValue={setLeagueId}
              value={leagueId}
            />
          </div>
          <div>
            <MultipleSelect
              data={teamsData}
              selectedIds={teamIds}
              setValue={setTeamIds}
            />
          </div>
          <Button disabled={loading} type="submit">
            {loading ? "loading..." : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

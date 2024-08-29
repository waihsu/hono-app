import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAppStore } from "@/store/use-app-store";
import SelectCountryLeague from "../select-country-league";
import { DateTimePicker } from "../date-time-picker";
import { Label } from "../ui/label";

// const formSchema = z.object({
//   home_team_id: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),

//   away_team_id:  z.string(),
//   match_date:  z.string(),
//   match_status: z.string()
// });

export default function NewMatchForm() {
  const { addMatch, teams } = useAppStore();
  const { token } = useTokenStore();
  const [matchDate, setMatchDate] = useState<Date | undefined>(undefined);

  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  // const [matchStatus, setMatchStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // 1. Define your form.

  // 2. Define a submit handler.
  async function onSubmit() {
    setLoading(true);
    const resp = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify({ homeTeamId, awayTeamId, matchDate }),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newMatch } = data;
      console.log(newMatch);
      addMatch(newMatch);
      toast({ title: "successful" });
    }
  }
  console.log(matchDate);
  return (
    <div className="space-y-8">
      {/* Home Team */}
      <div>
        <SelectCountryLeague
          data={teams}
          name="Home Teams"
          setValue={setHomeTeamId}
        />
      </div>
      {/* Away Team */}
      <div>
        <SelectCountryLeague
          data={teams}
          name="Away Teams"
          setValue={setAwayTeamId}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Match Time</Label>
        <DateTimePicker
          hourCycle={12}
          value={matchDate}
          onChange={setMatchDate}
        />
      </div>

      <Button disabled={loading} type="submit" onClick={onSubmit}>
        {loading ? "loading..." : "Create"}
      </Button>
    </div>
  );
}

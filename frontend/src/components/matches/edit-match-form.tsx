import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAdminStore } from "@/store/use-admin-store";
import SelectCountryLeague from "../select-country-league";
import { DateTimePicker } from "../date-time-picker";
import { Label } from "../ui/label";
import { Match } from "@/types/types";
import { Input } from "../ui/input";

// const formSchema = z.object({
//   home_team_id: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),

//   away_team_id:  z.string(),
//   match_date:  z.string(),
//   match_status: z.string()
// });

export default function EditMatchForm({
  match,
  ws,
}: {
  match: Match;
  ws: WebSocket;
}) {
  const { teams } = useAdminStore();
  const { token } = useTokenStore();
  const [matchDate, setMatchDate] = useState<Date>(new Date(match.match_date));

  const [matchStatus, setMatchStatus] = useState<string>(match.match_status);

  const [homeTeamId, setHomeTeamId] = useState<string>(match.home_team_id);
  const [awayTeamId, setAwayTeamId] = useState<string>(match.away_team_id);
  const [hometTeamScore, setHomeTeamScore] = useState<number>(
    match.home_team_score
  );
  const [awayTeamScore, setAwayTeamScore] = useState<number>(
    match.away_team_scroe
  );
  // const [matchStatus, setMatchStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit() {
    setLoading(true);
    const resp = await fetch(`/api/matches/${match.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify({
        id: match.id,
        homeTeamId,
        awayTeamId,
        matchDate,
        matchStatus,
        hometTeamScore,
        awayTeamScore,
      }),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { updatedMatch } = data;
      // console.log(updatedMatch);
      ws.send(
        JSON.stringify({
          type: "editmatch",
          message: updatedMatch,
          sendTo: "client",
        })
      );
      toast({ title: "successful" });
    }
  }
  console.log(matchDate);
  function onSeleteDate(date: Date | undefined) {
    if (!date) return;
    setMatchDate(date);
  }
  return (
    <div className="space-y-8">
      {/* Home Team */}
      <div>
        <SelectCountryLeague
          value={homeTeamId}
          data={teams}
          name="Home Teams"
          setValue={setHomeTeamId}
        />
      </div>
      {/* Away Team */}
      <div>
        <SelectCountryLeague
          value={awayTeamId}
          data={teams}
          name="Away Teams"
          setValue={setAwayTeamId}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Home Team Score</Label>
        <Input
          type="number"
          value={hometTeamScore}
          onChange={(ev) => setHomeTeamScore(Number(ev.target.value))}
          placeholder="Home team score"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Away Team Score</Label>
        <Input
          type="number"
          value={awayTeamScore}
          onChange={(ev) => setAwayTeamScore(Number(ev.target.value))}
          placeholder="Home team score"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Match Time</Label>
        <DateTimePicker
          hourCycle={12}
          value={matchDate}
          onChange={onSeleteDate}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Match Status</Label>
        <SelectCountryLeague
          value={matchStatus}
          data={[
            { id: "SCHEDULED", name: "SCHEDULED" },
            { id: "ONGOING", name: "ONGOING" },
            { id: "FINISHED", name: "FINISHED" },
          ]}
          name="Match Status"
          setValue={setMatchStatus}
        />
      </div>

      <Button disabled={loading} type="submit" onClick={onSubmit}>
        {loading ? "loading..." : "Update"}
      </Button>
    </div>
  );
}

import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import { Match } from "@/types/types";
import { matchColumns } from "./match-column";
import { MatchDataTable } from "./match-data-table";
import { useTokenStore } from "@/store/use-bear-store";

export default function RecentMatches() {
  const { matches, teams, publishMatches, ws, leagues } = useAdminStore();
  const { user, token } = useTokenStore();
  const navigate = useNavigate();

  const validLeague = (leagueCode: string) => {
    return leagues.find((item) => item.code === leagueCode);
  };

  const recentMatches: Match[] = matches.filter(
    (item) => item.match_status === "FINISHED"
  );

  const validTeams = (teamId: string) => {
    return teams.find((item) => item.id === teamId);
  };
  const beforeData = recentMatches
    .sort(
      (a, b) =>
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    )
    .map((item) => ({
      ws: ws,
      id: item.id,
      admin_id: user?.id,
      token: token,
      isPublish:
        publishMatches &&
        publishMatches.map((item) => item.match_id).includes(item.id)
          ? true
          : false,
      home_team: validTeams(item.home_team_id),
      away_team: validTeams(item.away_team_id),
      match_date: item.match_date,
      match_status: item.match_status,
      home_team_score: item.home_team_score,
      away_team_scroe: item.away_team_scroe,
      league: validLeague(item.league_code),
    }));

  return (
    <BackofficeLayout>
      <Heading
        button={
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </Button>
        }
        description=" matches"
        name="Recent Matches"
      />

      <div className=" space-y-8">
        <div>
          <MatchDataTable columns={matchColumns} data={beforeData} />
        </div>
      </div>
    </BackofficeLayout>
  );
}

import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronsRight, PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";

import { Match } from "@/types/types";

import { matchColumns } from "./match-column";
import { MatchDataTable } from "./match-data-table";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { useTokenStore } from "@/store/use-bear-store";

export default function Matches() {
  const { matches, teams, publishMatches, ws, leagues } = useAdminStore();
  const { user, token } = useTokenStore();

  const validLeague = (leagueCode: string) => {
    return leagues.find((item) => item.code === leagueCode);
  };

  const now: Date = new Date();
  const eighDaysAgo: Date = new Date(now);
  eighDaysAgo.setDate(now.getDate() - 8);

  const eighDaysAhead: Date = new Date(now);
  eighDaysAhead.setDate(now.getDate() + 8);

  const recentMatches: Match[] = matches.filter(
    (item) =>
      item.match_status === "FINISHED" && new Date(item.match_date) < now
  );

  const nextMatches: Match[] = matches
    // .filter((match) => match.user_id === user?.id)
    .filter((match) => {
      const matchDate = new Date(match.match_date);
      return (
        format(matchDate, "MM/dd/yyyy") >= format(now, "MM/dd/yyyy") &&
        format(matchDate, "MM/dd/yyyy") <= format(eighDaysAhead, "MM/dd/yyyy")
      );
    });
  // console.log("Recent Matches (Last 7 Days):", recentMatches);
  // console.log("Next Matches (Next 7 Days):", nextMatches);
  const validTeams = (teamId: string) => {
    return teams.find((item) => item.id === teamId);
  };
  const beforeData = recentMatches
    .sort(
      (a, b) =>
        new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
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
  const afterData = nextMatches
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
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/matches/new`}
          >
            <PlusCircle /> New Match
          </Link>
        }
        description="customize matches"
        name="Matches"
      />

      <div className=" w-full space-y-8">
        <div>
          <Link to={`/matches/recent`} className=" flex items-center gap-2">
            <h1 className="mb-2 text-2xl lg:text-xl">Recent Matches</h1>
            <ChevronsRight />
          </Link>
          <MatchDataTable columns={matchColumns} data={beforeData} />
        </div>
        <Separator className=" lg:hidden my-10" />
        <div>
          <Link to={`/matches/next`} className=" flex items-center gap-2">
            <h1 className="mb-2 text-2xl lg:text-xl">Next Matches</h1>
            <ChevronsRight />
          </Link>

          <MatchDataTable columns={matchColumns} data={afterData} />
        </div>
      </div>

      {/* <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-2">
        {nextMatches &&
          nextMatches.map((item) => {
            if (!item || !item.id) {
              console.log("invalid match");
              return null;
            }
            return (
              <Link to={`/matches/${item.id}`} key={item.id}>
                <MatchCard match={item} />
              </Link>
            );
          })}
      </div> */}
    </BackofficeLayout>
  );
}

import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import LeagueCard from "../leagues/league-card";
import { League } from "@/types/types";
import { runningLeagueIds } from "@/lib/client";

export default function RunningLeagueView() {
  const { leagues, runningLeagues } = useAdminStore();
  //   console.log(leagues);
  const runningLeaguesBySameLeagueId = runningLeagueIds(runningLeagues);
  const validLeague = (league_id: string) => {
    return leagues.find((league) => league.id === league_id) as League;
  };
  //   console.log(runningLeagues);
  //   console.log(runningLeaguesBySameLeagueId);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/runningleagues/new`}
          >
            <PlusCircle /> New Running League
          </Link>
        }
        description="teams are running in leagues"
        name="Running Leagues"
      />
      <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {runningLeaguesBySameLeagueId &&
          runningLeaguesBySameLeagueId.map((item) => (
            <Link to={`/runningleagues/${item.id}`} key={item.id}>
              <LeagueCard
                name={validLeague(item.league_id)?.name}
                image_url={validLeague(item.league_id).image_url}
              />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}

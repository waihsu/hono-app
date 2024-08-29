import React from "react";
import { Card } from "../ui/card";
import { Match } from "@/types/types";
import { useAppStore } from "@/store/use-app-store";
import { format } from "date-fns";
import RemainTime from "../remain-time";

export default function MatchCard({ match }: { match: Match }) {
  const { teams } = useAppStore();
  const homeTeam = teams.find((item) => item.id === match.home_team_id);
  const awayTeam = teams.find((item) => item.id === match.away_team_id);
  //   console.log(match.match_date);
  return (
    <Card className=" py-4">
      <div className="flex flex-col justify-center items-center gap-3 ">
        <div className="flex  items-center justify-evenly w-full  my-4 gap-3 ">
          <div className="flex w-full justify-evenly items-center gap-2 ">
            <p>{homeTeam?.name}</p>

            <img
              src={homeTeam?.image_url}
              alt=""
              className="w-12 h-12 sm:w-20 sm:h-20 object-center"
            />
            <p className=" text-xl sm:text-2xl font-bold">
              {match.away_team_scroe}
            </p>
          </div>

          <div className="flex w-full justify-evenly items-center gap-2">
            <p className="text-xl sm:text-2xl font-bold">
              {match.away_team_scroe}
            </p>
            <img
              src={awayTeam?.image_url}
              alt=""
              className="w-12 h-12 sm:w-20 sm:h-20 object-center"
            />
            <p className="text-wrap ">{awayTeam?.name}</p>
          </div>
        </div>
        <div className=" ">
          <RemainTime matchDate={match.match_date} />
        </div>
        <div>
          <p className="text-center">{format(match.match_date, "Pp")}</p>
        </div>
      </div>
    </Card>
  );
}

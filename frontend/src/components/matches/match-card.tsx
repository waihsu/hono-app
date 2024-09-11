import React from "react";
import { Card } from "../ui/card";
import { Match } from "@/types/types";
import { useAdminStore } from "@/store/use-admin-store";
import { format } from "date-fns";
import RemainTime from "../remain-time";

export default function MatchCard({ match }: { match: Match }) {
  const { teams } = useAdminStore();
  const homeTeam = teams.find((item) => item.id === match.home_team_id);
  const awayTeam = teams.find((item) => item.id === match.away_team_id);
  //   console.log(match.match_date);
  return (
    <Card className=" p-4 bg-background shadow-lg drop-shadow-md hover:drop-shadow-xl transition-all">
      <div className="flex flex-col justify-center items-center gap-3 ">
        <div className="grid grid-cols-3  w-full  my-4 sm:gap-3 ">
          <div className="flex w-full justify-center items-center gap-2">
            <p className="text-xs sm:text-sm text-center  text-pretty">
              {homeTeam?.shortName}
            </p>

            <img
              src={homeTeam?.image_url}
              alt=""
              className="w-6 h-6 sm:w-8 sm:h-8 object-center"
            />
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <p className=" text-xl sm:text-2xl font-bold">
              {match.away_team_scroe}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {match.away_team_scroe}
            </p>
          </div>
          <div className="flex w-full justify-center items-center gap-2 ">
            <img
              src={awayTeam?.image_url}
              alt=""
              className="w-6 h-6 sm:w-8 sm:h-8 object-center"
            />
            <p className="text-wrap text-center text-xs sm:text-sm">
              {awayTeam?.shortName}
            </p>
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

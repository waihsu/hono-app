import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatted } from "@/lib/client";
import { useAppStore } from "@/store/use-app-store";
import { Bet } from "@/types/types";

export default function BetHistoryCard({ bet }: { bet: Bet }) {
  const { matches, odds, bettingMarkets, teams, admins } = useAppStore();
  const validMatchId = bettingMarkets.find(
    (item) => item.id === bet.betting_market_id
  )?.match_id;
  const validMatch = matches.find((item) => item.id === validMatchId);
  const validHomeTeam = teams.find(
    (item) => item.id === validMatch?.home_team_id
  );
  const validAwayTeam = teams.find(
    (item) => item.id === validMatch?.away_team_id
  );
  const validOdd = odds.find((item) => item.id === bet.odd_id); // get valid odd from odds by betItem
  const validOddTeam = teams.find((item) => item.id === validOdd?.team_id);
  if (!validHomeTeam || !validAwayTeam || !validOddTeam) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Admin: {admins.find((item) => item.id === bet.admin_id)?.username}
        </CardTitle>
      </CardHeader>
      <CardContent className=" grid grid-rows-4 gap-2">
        <div className="">
          <p className="text-xs sm:text-lg font-semibold w-1/3 mb-2">Match</p>
          <div className="grid grid-cols-3  p-2 border border-border rounded-md w-full">
            <div className="flex w-full justify-center items-center gap-2 ">
              <img
                src={validHomeTeam.image_url}
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 object-center"
              />
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <p className=" text-sm md:text-lg font-bold">
                {validMatch?.home_team_score}
              </p>
              <p className="text-sm md:text-lg font-bold">
                {validMatch?.away_team_scroe}
              </p>
            </div>

            <div className="flex w-full justify-center items-center gap-2">
              <img
                src={validAwayTeam.image_url}
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 object-center"
              />
            </div>
          </div>
        </div>
        <div className=" ">
          <p className="text-xs sm:text-lg font-semibold  w-1/3 mb-2">Odd</p>
          <div className="grid grid-cols-2   gap-2 p-2 border border-border rounded-md w-full">
            <div className="flex w-full justify-center items-center gap-2 ">
              <img
                src={validOddTeam.image_url}
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 object-center"
              />
            </div>
            <div className="flex items-center justify-between">
              <p>{validOdd?.outcome}</p>
              <p className=" text-primary">{validOdd?.odd_value}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p>Amount</p>
          <p className=" text-primary">{formatted(bet.amount)}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p>Status</p>
          <p>{bet.bet_status}</p>
        </div>
      </CardContent>
    </Card>
  );
}

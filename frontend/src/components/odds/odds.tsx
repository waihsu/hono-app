import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import OddCard from "./odd-card";

export default function Odds() {
  const { bettingMarketId, matchId } = useParams();
  const location = useLocation();
  const { bettingMarkets, odds, teams } = useAppStore();
  const validBettingMarket = bettingMarkets.find(
    (item) => item.id === bettingMarketId
  );
  const searchParams = new URLSearchParams(location.search);
  // console.log(location.search);
  const home_team_id = searchParams.get("home_id");
  const away_team_id = searchParams.get("away_id");
  // console.log(home_team_id, away_team_id);
  const homeTeam = teams.find((item) => item.id === home_team_id);
  const awayTeam = teams.find((item) => item.id === away_team_id);
  const homeOdds = odds.filter(
    (item) =>
      item.team_id === home_team_id &&
      item.betting_market_id === bettingMarketId
  );
  const awayOdds = odds.filter(
    (item) =>
      item.team_id === away_team_id &&
      item.betting_market_id === bettingMarketId
  );
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/odds/${matchId}/${bettingMarketId}/new?away_id=${away_team_id}&home_id=${home_team_id}`}
          >
            <PlusCircle /> New Odd
          </Link>
        }
        description="customize odds"
        name={`${validBettingMarket?.market_type} Market By Odds`}
      />
      <Link
        className={cn(
          buttonVariants({ size: "sm" })
          // "flex items-center gap-x-2"
        )}
        to={`/backoffice/bettingMarkets/${matchId}`}
      >
        <ArrowLeft /> Back
      </Link>
      <div className=" grid grid-cols-2  gap-2">
        <div>
          <div className="text-sm md:text-4xl text-center  py-2 my-1">
            <h1>{homeTeam?.name}</h1>
          </div>
          <div className="flex flex-col gap-2">
            {homeOdds &&
              homeOdds.map((item) => (
                <Link
                  to={`/backoffice/odds/${item.id}?away_id=${away_team_id}&home_id=${home_team_id}`}
                  key={item.id}
                >
                  <OddCard odd={item} />
                </Link>
              ))}
          </div>
        </div>
        <div>
          <div className="text-sm md:text-4xl text-center py-2 my-1">
            <h1>{awayTeam?.name}</h1>
          </div>
          <div className="flex flex-col gap-2">
            {awayOdds &&
              awayOdds.map((item) => (
                <Link
                  to={`/backoffice/odds/${item.id}?away_id=${away_team_id}&home_id=${home_team_id}`}
                  key={item.id}
                >
                  <OddCard odd={item} />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
}

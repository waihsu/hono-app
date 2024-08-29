import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export default function Odds() {
  const { bettingMarketId } = useParams();
  const location = useLocation();
  const { bettingMarkets } = useAppStore();
  const validBettingMarket = bettingMarkets.find(
    (item) => item.id === bettingMarketId
  );
  const searchParams = new URLSearchParams(location.search);
  console.log(location.search);
  const home_team_id = searchParams.get("home_id");
  const away_team_id = searchParams.get("away_id");
  console.log(home_team_id, away_team_id);

  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/odds/${bettingMarketId}/new?away_id=${away_team_id}&home_id=${home_team_id}`}
          >
            <PlusCircle /> New Odd
          </Link>
        }
        description="customize odds"
        name={`${validBettingMarket?.market_type} Market By Odds`}
      />
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        Odds
      </div>
    </BackofficeLayout>
  );
}

import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";

import { useAppStore } from "@/store/use-app-store";
import MatchCard from "../matches/match-card";

export default function BettingMarketsByMatch() {
  const { matches } = useAppStore();
  return (
    <BackofficeLayout>
      <Heading
        button
        description="select a match to create,update and delete market"
        name="Betting Markets"
      />
      <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-2">
        {matches &&
          matches.map((item) => (
            <Link to={`/backoffice/bettingMarkets/${item.id}`} key={item.id}>
              <MatchCard match={item} />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}

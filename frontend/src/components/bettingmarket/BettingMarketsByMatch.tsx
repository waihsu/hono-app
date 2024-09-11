import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";

import { useAdminStore } from "@/store/use-admin-store";
import MatchCard from "../matches/match-card";

export default function BettingMarketsByMatch() {
  const { matches, publishMatches } = useAdminStore();

  const validMatches = (matchId: string) => {
    return matches.find((item) => item.id === matchId);
  };

  return (
    <BackofficeLayout>
      <Heading
        button
        description="select a match to create,update and delete market"
        name="Betting Markets"
      />
      <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-2">
        {publishMatches &&
          publishMatches.map((item) => {
            const match = validMatches(item.match_id);
            if (!match) return null;
            return (
              <Link to={`/bettingMarkets/${item.id}`} key={item.id}>
                <MatchCard match={match} />
              </Link>
            );
          })}
      </div>
    </BackofficeLayout>
  );
}

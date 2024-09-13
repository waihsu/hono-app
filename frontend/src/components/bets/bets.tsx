import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { betColumns } from "./bet-columns";
import { useAdminStore } from "@/store/use-admin-store";
import { Match } from "@/types/types";
import { useTokenStore } from "@/store/use-bear-store";
import { DataTable } from "../data-table";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Bets() {
  const {
    matches,
    bettingMarkets,
    teams,
    odds,
    bets,
    users,
    ws,
    publishMatches,
  } = useAdminStore();
  const { token, user: CurrentUser } = useTokenStore();
  const navigate = useNavigate();

  const validMatch = (bettingMarketId: string) => {
    const bettingMarket = bettingMarkets.find(
      (item) => item.id === bettingMarketId
    );
    const publishMatch = publishMatches.find(
      (item) => item.id === bettingMarket?.publish_match_id
    );

    const match = matches.find(
      (item) => item.id === publishMatch?.match_id
    ) as Match;
    const validHomeTeam = teams.find((item) => item.id === match?.home_team_id);
    const validAwayTeam = teams.find((item) => item.id === match?.away_team_id);
    return { validAwayTeam, validHomeTeam, match };
  };

  const validOdd = (oddId: string) => {
    const validOdds = odds.find((item) => item.id === oddId);
    const validOddTeam = teams.find((item) => item.id === validOdds?.team_id);
    return { validOddTeam, validOdds };
  }; // get valid odd from odds by betItem

  function validUser(userId: string) {
    return users.find((user) => user.id === userId);
  }
  // betId,user,status,amount,match,
  const testBets = bets.map((item) => ({
    token: token,
    ws: ws,
    id: item.id,
    admin_id: CurrentUser?.id,
    user: validUser(item.user_id),
    email: validUser(item.user_id)?.email as string,
    status: item.bet_status,
    amount: item.amount,
    match: validMatch(item.betting_market_id),
    odd: validOdd(item.odd_id),
    created_At: item.created_at,
  }));
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft /> Back
          </Button>
        }
        description="Bet Lists"
        name="Bets"
      />
      <div>
        <DataTable columns={betColumns} data={testBets} />
      </div>
    </BackofficeLayout>
  );
}

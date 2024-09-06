import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { useAdminStore } from "@/store/use-admin-store";
import { betColumns } from "./bet-columns";
import { useAppStore } from "@/store/use-app-store";
import { Match } from "@/types/types";
import { useTokenStore } from "@/store/use-bear-store";
import { DataTable } from "../data-table";

export default function Bets() {
  const { bets, users } = useAdminStore();
  const { matches, bettingMarkets, teams, odds } = useAppStore();
  const { token } = useTokenStore();
  // console.log(bets);

  const validMatch = (bettingMarketId: string) => {
    const validMatchId = bettingMarkets.find(
      (item) => item.id === bettingMarketId
    )?.match_id;
    const match = matches.find((item) => item.id === validMatchId) as Match;
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
    id: item.id,
    user: validUser(item.user_id),
    email: validUser(item.user_id)?.email as string,
    status: item.bet_status as string,
    amount: item.amount,
    match: validMatch(item.betting_market_id),
    odd: validOdd(item.odd_id),
    created_At: item.created_at,
  }));
  return (
    <BackofficeLayout>
      <Heading button description="Bet Lists" name="Bets" />
      <div>
        <DataTable columns={betColumns} data={testBets} />
      </div>
    </BackofficeLayout>
  );
}

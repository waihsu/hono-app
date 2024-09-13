import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";

import { useAdminStore } from "@/store/use-admin-store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { formatted } from "@/lib/client";
import { useTokenStore } from "@/store/use-bear-store";
import { Match } from "@/types/types";
import { DataTable } from "../data-table";
import { betColumns } from "../bets/bet-columns";
import { TransationColumns } from "../transations/transation-columns";

export default function SingleCustomerView() {
  const { userId } = useParams();
  const {
    users,
    transations,
    bets,
    ws,
    bettingMarkets,
    publishMatches,
    matches,
    teams,
    odds,
    payments,
  } = useAdminStore();
  const { token, user: Admin } = useTokenStore();

  const validUser = users.find((user) => user.id === userId);
  if (!validUser) return null;
  const validUserTransations = transations.filter(
    (item) => item.user_id === validUser.id
  );
  const validUserBets = bets.filter((item) => item.user_id === validUser.id);
  console.log(validUserBets, validUserTransations);

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

  const betsDataForColumns = bets.map((item) => ({
    token: token,
    ws: ws,
    id: item.id,
    admin_id: Admin?.id,
    user: validUser,
    email: validUser.email as string,
    status: item.bet_status,
    amount: item.amount,
    match: validMatch(item.betting_market_id),
    odd: validOdd(item.odd_id),
    created_At: item.created_at,
  }));

  const validPayment = (paymentId: string) => {
    return payments.find((item) => item.id === paymentId);
  };

  const newTransations = transations.map((item) => ({
    id: item.id,
    admin_id: Admin?.id,
    ws: ws,
    amount: item.amount,
    token: token,
    name: item.name,
    user: validUser,
    email: validUser.email as string,
    transfer_id: item.transfer_id,
    transation_status: item.transation_status,
    phone_number: item.phone_number,
    payment: validPayment(item.payment_id),
    created_At: item.created_at,
  }));
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/customers`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="customers lists"
        name={validUser?.username}
      />

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 uppercase">
            <div>
              <h6>name:</h6>
              <h6>email:</h6>
              <h6>account status</h6>
              <h6>balance</h6>
            </div>
            <div>
              <h6>{validUser.username}</h6>
              <h6>{validUser.email}</h6>
              <h6>{validUser.account_status}</h6>
              <h6>{formatted(validUser.balance)} Ks</h6>
            </div>
          </CardContent>
        </Card>
        <div className=" mt-6">
          <h1>User Bets List</h1>
          <DataTable columns={betColumns} data={betsDataForColumns} />
        </div>
        <div className=" mt-6">
          <h1>User Transation List</h1>
          <DataTable columns={TransationColumns} data={newTransations} />
        </div>
      </div>
    </BackofficeLayout>
  );
}

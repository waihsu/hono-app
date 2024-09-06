import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BetItem, useBetCartStore } from "@/store/use-bet-cart";
import { useAppStore } from "@/store/use-app-store";

import { Button } from "@/components/ui/button";
import { Minus, Plus, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/delete-dialog";
import { useNavigate } from "react-router-dom";

export default function CartCard({ betItem }: { betItem: BetItem }) {
  const socket = new WebSocket(
    `ws://localhost:3000/admin?type=newbet${betItem.adminId}`
  );
  const {
    matches,
    odds,
    bettingMarkets,
    teams,
    admins,
    currentUser,
    setCurrentUser,
  } = useAppStore();
  const { token } = useTokenStore();
  const { removeItem } = useBetCartStore();
  const navigate = useNavigate();

  const [betAmount, setBetAmount] = useState(Number(betItem.amount));
  const [loading, setLoading] = useState(false);
  const validMatchId = bettingMarkets.find(
    (item) => item.id === betItem.bettingMarketId
  )?.match_id;
  const validMatch = matches.find((item) => item.id === validMatchId);
  const validHomeTeam = teams.find(
    (item) => item.id === validMatch?.home_team_id
  );
  const validAwayTeam = teams.find(
    (item) => item.id === validMatch?.away_team_id
  );
  const validOdd = odds.find((item) => item.id === betItem.oddId); // get valid odd from odds by betItem
  const validOddTeam = teams.find((item) => item.id === validOdd?.team_id);
  if (!validHomeTeam || !validAwayTeam || !validOddTeam) return null;
  //   console.log(betItem);
  function Increase() {
    setBetAmount(Number(betAmount) + 500);
  }
  function Decrease() {
    setBetAmount(Number(betAmount) - 500 < 500 ? 500 : Number(betAmount) - 500);
  }

  async function confirmBet() {
    if (!currentUser) return toast({ title: "You must be logged in." });
    if (currentUser.balance < betAmount)
      return toast({
        title: "Balance Low",
        variant: "destructive",
        action: (
          <Button variant={"link"} onClick={() => navigate("/deposit")}>
            <PlusCircle />
            Top Up
          </Button>
        ),
      });
    setLoading(true);

    const resp = await fetch(`/api/bets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify({
        user_id: currentUser.id,
        betting_market_id: betItem.bettingMarketId,
        odd_id: betItem.oddId,
        amount: betAmount,
        admin_id: betItem.adminId,
      }),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newBet, currentUserUpdated } = data;
      socket.send(JSON.stringify(newBet));
      setCurrentUser(currentUserUpdated);
      removeItem(betItem.id);
    }
  }

  return (
    <Card className=" max-w-sm relative">
      <CardHeader>
        <CardTitle>
          Admin : {admins.find((item) => item.id === betItem.adminId)?.username}
        </CardTitle>
      </CardHeader>
      <CardContent className=" space-y-4">
        <div className=" flex  items-center justify-between gap-x-2 ">
          <p className="text-sm sm:text-xl font-semibold w-1/3 ">Match</p>
          <div className="grid grid-cols-2  max-w-xs p-2 border border-border rounded-md w-full">
            <div className="flex w-full justify-center items-center gap-2 ">
              <p className="text-xs sm:text-sm text-center  text-pretty">
                {validHomeTeam.name}
              </p>

              <img
                src={validHomeTeam.image_url}
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 object-center"
              />
            </div>
            {/* <div>-</div> */}

            <div className="flex w-full justify-center items-center gap-2">
              <img
                src={validAwayTeam.image_url}
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 object-center"
              />
              <p className="text-xs sm:text-sm text-center  text-pretty">
                {validAwayTeam.name}
              </p>
            </div>
          </div>
        </div>
        <div className=" flex  items-center justify-between gap-x-2 ">
          <p className="text-sm sm:text-xl font-semibold  w-1/3 ">Odd</p>
          <div className="grid grid-cols-2  max-w-xs gap-2 p-2 border border-border rounded-md w-full">
            <div className="flex w-full justify-center items-center gap-2 ">
              <p className="text-xs sm:text-sm text-center  text-pretty">
                {validOddTeam.name}
              </p>

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
        <div className=" flex  items-center justify-between gap-x-2 ">
          <p className="text-sm sm:text-xl font-semibold  w-1/3 ">Amount</p>
          <div className="flex items-center  gap-2 ">
            <div>
              <Button size={"icon"} onClick={Decrease}>
                <Minus />
              </Button>
            </div>
            <Input
              type="number"
              value={betAmount < 500 ? 500 : betAmount}
              onChange={(ev) => setBetAmount(Number(ev.target.value))}
            />
            <div>
              <Button size={"icon"} onClick={Increase}>
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-2">
        <DeleteDialog
          children={
            <Button
              variant={"destructive"}
              //   onClick={() => }
              size={"sm"}
            >
              Delete
            </Button>
          }
          onDelete={() => removeItem(betItem.id)}
        />
        <Button onClick={confirmBet} disabled={loading} size={"sm"}>
          {loading ? "Loading..." : "Confirm"}
        </Button>
      </CardFooter>
    </Card>
  );
}

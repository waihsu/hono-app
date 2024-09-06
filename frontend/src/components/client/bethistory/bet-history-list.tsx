import { Bet } from "@/types/types";
import React from "react";
import BetHistoryCard from "./bet-history-card";

interface BetHistoryListProps {
  bets: Bet[];
}

export default function BetHistoryList({ bets }: BetHistoryListProps) {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
      {bets &&
        bets.map((item) => (
          <div key={item.id} className="">
            <BetHistoryCard bet={item} />
          </div>
        ))}
    </div>
  );
}

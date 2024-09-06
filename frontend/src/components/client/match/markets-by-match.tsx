import Layout from "@/components/layout";
import MatchCard from "@/components/matches/match-card";
import OddCard from "@/components/odds/odd-card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { generateRandomId } from "@/lib/generateRandomId";
import { useAppStore } from "@/store/use-app-store";
import { useTokenStore } from "@/store/use-bear-store";
import { useBetCartStore } from "@/store/use-bet-cart";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function MarketByMatch() {
  const { matchId, adminId } = useParams();
  const navigate = useNavigate();
  const { matches, bettingMarkets, odds } = useAppStore();
  const { user } = useTokenStore();
  const { addItem } = useBetCartStore();
  const validMatch = matches.find((item) => item.id === matchId);
  if (!validMatch) return null;
  const home_team_id = validMatch.home_team_id;
  const away_team_id = validMatch.away_team_id;
  const homeOdds = (bettingMarketId: string) => {
    return odds.filter(
      (item) =>
        item.team_id === home_team_id &&
        item.betting_market_id === bettingMarketId
    );
  };
  const awayOdds = (bettingMarketId: string) => {
    return odds.filter(
      (item) =>
        item.team_id === away_team_id &&
        item.betting_market_id === bettingMarketId
    );
  };

  const validBettingMarkets = bettingMarkets.filter(
    (item) => item.match_id === matchId
  );

  function addBetCart({
    userId,
    bettingMarketId,
    oddId,
  }: {
    userId: string;
    bettingMarketId: string;
    oddId: string;
  }) {
    if (!userId || !adminId) return toast({ title: "You must be logged in." });

    addItem({
      id: generateRandomId(),
      bettingMarketId,
      oddId,
      userId,
      amount: 500,
      adminId,
    });
  }

  return (
    <Layout>
      <div className="container">
        <Button
          className=" flex items-center gap-x-2 my-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Back
        </Button>
        <MatchCard match={validMatch} />
        {/* <Separator className=" my-8" /> */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-semibold my-10">
            Markets Lists
          </h1>
          <Separator className="mb-2" />
          <Accordion type="single" collapsible>
            {validBettingMarkets &&
              validBettingMarkets.map((bettingMarket) => {
                if (!bettingMarket || !bettingMarket.id) {
                  console.error("Invalid betting market:", bettingMarket);
                  return null;
                }
                return (
                  <AccordionItem
                    value={bettingMarket.id}
                    key={bettingMarket.id}
                  >
                    <AccordionTrigger>
                      {bettingMarket.market_type}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Separator className=" mb-2" />
                      <div className="flex justify-between items-center my-3">
                        <h1 className="text-lg font-semibold">Odds</h1>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          {homeOdds(bettingMarket.id) &&
                            homeOdds(bettingMarket.id).map((odd) => (
                              <div
                                key={odd.id}
                                onClick={() =>
                                  addBetCart({
                                    userId: String(user?.id),
                                    bettingMarketId: bettingMarket.id,
                                    oddId: odd.id,
                                  })
                                }
                                className="my-2"
                              >
                                <OddCard odd={odd} />
                              </div>
                            ))}
                        </div>
                        <div>
                          {awayOdds(bettingMarket.id) &&
                            awayOdds(bettingMarket.id).map((odd) => (
                              <div
                                key={odd.id}
                                onClick={() =>
                                  addBetCart({
                                    userId: String(user?.id),
                                    bettingMarketId: bettingMarket.id,
                                    oddId: odd.id,
                                  })
                                }
                                className="my-2"
                              >
                                <OddCard odd={odd} />
                              </div>
                            ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}

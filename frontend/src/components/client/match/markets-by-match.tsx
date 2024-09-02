import Layout from "@/components/layout";
import MatchCard from "@/components/matches/match-card";
import OddCardList from "@/components/odds/odd-card-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/use-app-store";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function MarketByMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { matches, bettingMarkets, odds } = useAppStore();
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
  return (
    <Layout>
      <div className="container">
        <MatchCard match={validMatch} />
        {/* <Separator className=" my-8" /> */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-semibold my-10">
            Markets Lists
          </h1>
          <Separator className="mb-2" />
          <Accordion type="single" collapsible>
            {validBettingMarkets &&
              validBettingMarkets.map((item) => {
                if (!item || !item.id) {
                  console.error("Invalid betting market:", item);
                  return null;
                }
                return (
                  <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger>
                      <Link
                        className="text-xl sm:text-2xl"
                        to={`/backoffice/odds/${matchId}/${item.id}?away_id=${validMatch.away_team_id}&home_id=${validMatch.home_team_id}`}
                      >
                        {item.market_type}
                      </Link>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Separator className=" mb-2" />
                      <div className="flex justify-between items-center my-3">
                        <h1 className="text-lg font-semibold">Odds</h1>
                        <Button
                          variant={"default"}
                          className=" ml-auto items-end"
                          onClick={() =>
                            navigate(
                              `/backoffice/odds/${matchId}/${item.id}/new?away_id=${validMatch.away_team_id}&home_id=${validMatch.home_team_id}`
                            )
                          }
                        >
                          Create Odd
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <OddCardList
                            className="flex flex-col gap-2"
                            odds={homeOdds(item.id)}
                          />
                        </div>
                        <div>
                          <OddCardList
                            className="flex flex-col gap-2"
                            odds={awayOdds(item.id)}
                          />
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

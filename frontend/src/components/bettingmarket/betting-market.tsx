import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Edit, PlusCircle, Trash } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import MatchCard from "../matches/match-card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OddCardList from "@/components/odds/odd-card-list";
import { Separator } from "@/components/ui/separator";
import DeleteDialog from "../delete-dialog";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";

export default function BettingMarket() {
  const socket = new WebSocket(
    `ws://localhost:3000/api/matches?type=deleteBettingMarket`
  );
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { matches, bettingMarkets, odds } = useAppStore();
  const { token } = useTokenStore();
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

  const onDelete = async (bettingMarketId: string) => {
    const resp = await fetch(`/api/bettingmarkets/${bettingMarketId}`, {
      method: "DELETE",
      headers: {
        Bearer: token,
      },
    });
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { deletedBettingMarket } = data;
      console.log(deletedBettingMarket);
      socket.send(JSON.stringify(deletedBettingMarket));
      toast({ title: "successful" });
    }
  };

  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/bettingMarket/${matchId}/newbettingmarket`}
          >
            <PlusCircle /> New Market
          </Link>
        }
        description="customize markets"
        name="Betting Markets"
      />
      <div className=" ">
        <Button
          variant={"outline"}
          className="flex items-center gap-x-2 mb-3"
          onClick={() => navigate(`/backoffice/bettingMarkets`)}
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
                      <div className="flex items-center gap-2">
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          onClick={() =>
                            navigate(
                              `/backoffice/bettingMarket/edit/${item.id}`
                            )
                          }
                        >
                          <Edit />
                        </Button>
                        <DeleteDialog onDelete={() => onDelete(item.id)}>
                          <Button size={"icon"} variant={"destructive"}>
                            <Trash />
                          </Button>
                        </DeleteDialog>
                      </div>
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
    </BackofficeLayout>
  );
}

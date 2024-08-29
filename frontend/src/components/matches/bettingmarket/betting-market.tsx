import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import MatchCard from "../match-card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BettingMarket() {
  const { id } = useParams();
  // console.log(id);
  const { matches, bettingMarkets } = useAppStore();
  const validMatch = matches.find((item) => item.id === id);
  if (!validMatch) return null;
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/matches/${id}/newbettingmarket`}
          >
            <PlusCircle /> New Market
          </Link>
        }
        description="customize markets"
        name="Betting Markets"
      />
      <div className=" ">
        <MatchCard match={validMatch} />
        <Separator className=" my-8" />
        <div>
          <h1 className=" text-4xl font-semibold">Markets</h1>
          <Accordion type="single" collapsible>
            {bettingMarkets &&
              bettingMarkets.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger>
                    <Link
                      to={`/backoffice/odds/${item.id}?away_id=${validMatch.away_team_id}&home_id=${validMatch.home_team_id}`}
                    >
                      {item.market_type}
                    </Link>
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </BackofficeLayout>
  );
}

import React from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { buttonVariants } from "@/components/ui/button";
import BettingMarketForm from "./betting-market-form";

export default function NewBettingMarket() {
  const { id } = useParams();
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/matches/${id}`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a betting market"
        name="Create Betting Market"
      />
      <div className=" max-w-lg">
        <BettingMarketForm match_id={String(id)} />
      </div>
    </BackofficeLayout>
  );
}

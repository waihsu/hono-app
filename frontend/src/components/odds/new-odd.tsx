import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewOddForm from "./new-odd-form";
import { useAppStore } from "@/store/use-app-store";

export default function NewOdd() {
  const { bettingMarketId } = useParams();
  const { teams } = useAppStore();
  if (!bettingMarketId) return null;
  const searchParams = new URLSearchParams(location.search);
  console.log(location.search);
  const home_team_id = searchParams.get("home_id");
  const away_team_id = searchParams.get("away_id");
  console.log(home_team_id, away_team_id);
  const validTeams = teams.filter(
    (item) => item.id === home_team_id || item.id === away_team_id
  );
  console.log(validTeams);
  const data = validTeams.map((item) => ({ id: item.id, name: item.name }));
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/odds/${bettingMarketId}?away_id=${away_team_id}&home_id=${home_team_id}`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create an Odd"
        name="Create Odd"
      />
      <div className=" max-w-lg">
        <NewOddForm bettingMarketId={bettingMarketId} data={data} />
      </div>
    </BackofficeLayout>
  );
}

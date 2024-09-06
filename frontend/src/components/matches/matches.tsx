import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import MatchCard from "./match-card";
import { useTokenStore } from "@/store/use-bear-store";

export default function Matches() {
  const { matches } = useAppStore();
  const { user } = useTokenStore();
  const AdminByMatches = matches.filter((match) => match.user_id === user?.id);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/matches/new`}
          >
            <PlusCircle /> New Match
          </Link>
        }
        description="customize matches"
        name="Matches"
      />
      <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-2">
        {AdminByMatches &&
          AdminByMatches.map((item) => {
            if (!item || !item.id) {
              console.log("invalid match");
              return null;
            }
            return (
              <Link to={`/backoffice/matches/${item.id}`} key={item.id}>
                <MatchCard match={item} />
              </Link>
            );
          })}
      </div>
    </BackofficeLayout>
  );
}

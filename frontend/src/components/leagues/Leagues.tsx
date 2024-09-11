import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import LeagueCard from "./league-card";

export default function Leagues() {
  const { leagues } = useAdminStore();
  console.log(leagues);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/leagues/new`}
          >
            <PlusCircle /> New League
          </Link>
        }
        description="leagues"
        name="Leagues"
      />
      <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {leagues &&
          leagues.map((item) => (
            <Link to={`/leagues/${item.id}`} key={item.id}>
              <LeagueCard name={item.name} image_url={item.image_url} />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}

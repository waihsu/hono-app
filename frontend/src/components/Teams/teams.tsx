import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import TeamCard from "./team-card";

export default function Teams() {
  const { teams } = useAdminStore();
  console.log(teams);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/teams/new`}
          >
            <PlusCircle /> New Team
          </Link>
        }
        description="customize teams"
        name="Teams"
      />
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {teams &&
          teams.map((item) => (
            <Link to={`/teams/${item.id}`} key={item.id}>
              <TeamCard image_url={item.image_url} name={item.name} />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}

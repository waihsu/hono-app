import React, { useState } from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import TeamCard from "./team-card";
import { Input } from "../ui/input";

export default function Teams() {
  const { teams } = useAdminStore();
  const [searchName, setSearchName] = useState("");
  const searchTeams = teams.filter((team) =>
    team.shortName.toLowerCase().includes(searchName.toLowerCase())
  );
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
      <div className=" mb-4">
        <Input
          placeholder="search name"
          onChange={(ev) => setSearchName(ev.target.value)}
        />
      </div>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {searchTeams &&
          searchTeams.map((item) => (
            <Link to={`/teams/${item.id}`} key={item.id}>
              <TeamCard image_url={item.image_url} name={item.shortName} />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}

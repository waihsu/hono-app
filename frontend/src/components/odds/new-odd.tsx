import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewOddForm from "./new-odd-form";
import { useAppStore } from "@/store/use-app-store";
import { useNavigate, useParams } from "react-router-dom";

export default function NewOdd() {
  const { bettingMarketId } = useParams();
  const { teams } = useAppStore();
  const navigate = useNavigate();
  if (!bettingMarketId) return null;
  const searchParams = new URLSearchParams(location.search);
  // console.log(location.search);
  const home_team_id = searchParams.get("home_id");
  const away_team_id = searchParams.get("away_id");
  console.log(home_team_id, away_team_id);
  const validTeams = teams.filter(
    (item) => item.id === home_team_id || item.id === away_team_id
  );
  // console.log(validTeams);
  const data = validTeams.map((item) => ({ id: item.id, name: item.name }));
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Button
            size={"sm"}
            className="flex items-center gap-x-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft /> Back
          </Button>
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

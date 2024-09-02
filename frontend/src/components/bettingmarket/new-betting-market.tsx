import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import BettingMarketForm from "./betting-market-form";

export default function NewBettingMarket() {
  const navigate = useNavigate();
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Button
            variant={"outline"}
            className="flex items-center gap-x-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft /> Back
          </Button>
        }
        description="create a betting market"
        name="Create Betting Market"
      />
      <div className=" max-w-lg">
        <BettingMarketForm />
      </div>
    </BackofficeLayout>
  );
}

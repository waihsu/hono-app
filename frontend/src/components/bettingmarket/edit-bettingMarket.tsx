import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import EditBettingMarketForm from "./edit-betting-market-form";
import { useAdminStore } from "@/store/use-admin-store";

export default function EditBettingMarket() {
  const navigate = useNavigate();
  const { bettingMarketId } = useParams();
  const { bettingMarkets } = useAdminStore();
  const validBettingMarket = bettingMarkets.find(
    (item) => item.id === bettingMarketId
  );
  if (!validBettingMarket) return null;
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
        description="edit your betting market"
        name="Edit Betting Market"
      />
      <div>
        <EditBettingMarketForm bettingMarket={validBettingMarket} />
      </div>
    </BackofficeLayout>
  );
}

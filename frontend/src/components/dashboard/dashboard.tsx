import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { ArrowLeftRight, CreditCard, Users } from "lucide-react";
import BackofficeItemCard from "../backoffice-item-card";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/store/use-admin-store";

export default function BackofficeDashboard() {
  const { users, bets, transations } = useAdminStore();
  return (
    <BackofficeLayout>
      <Heading button description="" name="Dashboard" />
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to={"/customers"}>
            <BackofficeItemCard
              icon={
                <Users className="h-4 w-4 md:h-8 md:w-8 text-muted-foreground" />
              }
              name="Total Users"
              value={users.length}
            />
          </Link>
          <Link to={"/bets"}>
            <BackofficeItemCard
              icon={
                <CreditCard className="h-4 w4 md:h-8 md:w-8 text-muted-foreground" />
              }
              name="Bets"
              value={bets.length}
            />
          </Link>
          <Link to={"/transations"}>
            <BackofficeItemCard
              icon={
                <ArrowLeftRight className="h-4 w4 md:h-8 md:w-8 text-muted-foreground" />
              }
              name="Transations"
              value={transations.length}
            />
          </Link>
        </div>
        <div className=" my-10">{/* <Overview prices={prices} /> */}</div>
      </div>
    </BackofficeLayout>
  );
}

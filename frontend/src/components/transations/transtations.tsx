import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { useAdminStore } from "@/store/use-admin-store";
import { DataTable } from "../data-table";
import { TransationColumns } from "./transation-columns";
import { useTokenStore } from "@/store/use-bear-store";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function Transations() {
  const { transations, users, payments, ws } = useAdminStore();
  const { token, user: CurrentUser } = useTokenStore();
  // console.log(transations);
  const validUser = (userId: string) => {
    return users.find((item) => item.id === userId);
  };

  const validPayment = (paymentId: string) => {
    return payments.find((item) => item.id === paymentId);
  };

  const newTransations = transations.map((item) => ({
    id: item.id,
    admin_id: CurrentUser?.id,
    ws: ws,
    amount: item.amount,
    token: token,
    name: item.name,
    user: validUser(item.user_id),
    email: validUser(item.user_id)?.email as string,
    transfer_id: item.transfer_id,
    transation_status: item.transation_status,
    phone_number: item.phone_number,
    payment: validPayment(item.payment_id),
    created_At: item.created_at,
  }));
  if (!ws) return null;
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/dashboard`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="Transation lists"
        name="Transations"
      />
      <div>
        <DataTable columns={TransationColumns} data={newTransations} />
      </div>
    </BackofficeLayout>
  );
}

import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

import PaymentCard from "../payment-card";
import { useAdminStore } from "@/store/use-admin-store";

export default function Payments() {
  const { payments } = useAdminStore();
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/payments/new`}
          >
            <PlusCircle /> New Payment
          </Link>
        }
        description="create payment method"
        name="Payments"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            href={`/backoffice/payments/${payment.id}`}
          />
        ))}
      </div>
    </BackofficeLayout>
  );
}

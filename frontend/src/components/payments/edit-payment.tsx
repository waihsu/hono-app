import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";

import EditPaymentForm from "./edit-payment-form";
import { useAppStore } from "@/store/use-app-store";

export default function EditPayment() {
  const { paymentId } = useParams();
  const { payments } = useAppStore();
  const validPayment = payments.find((item) => item.id === paymentId);
  if (!validPayment) return null;
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/payments`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="customize a payment"
        name="Edit Payment"
      />
      <div>
        <EditPaymentForm payment={validPayment} />
      </div>
    </BackofficeLayout>
  );
}
